-- El navegador recibe un token aleatorio por instalación. La función Edge valida
-- su hash y mantiene toda la progresión de la partida del lado del servidor.
create extension if not exists pgcrypto;

create table if not exists public.gambito_visitors (
  id uuid primary key default gen_random_uuid(),
  token_hash text not null unique,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create table if not exists public.gambito_participants (
  visitor_id uuid primary key references public.gambito_visitors(id) on delete cascade,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  careers_started integer not null default 0 check (careers_started >= 0),
  careers_completed integer not null default 0 check (careers_completed >= 0)
);

create table if not exists public.gambito_sessions (
  id uuid primary key default gen_random_uuid(),
  visitor_id uuid not null references public.gambito_visitors(id) on delete cascade,
  player_name text not null check (char_length(player_name) between 1 and 18),
  debug boolean not null default false,
  season smallint not null default 1 check (season between 1 and 11),
  level smallint not null default 0 check (level between 0 and 10),
  wins smallint not null default 0 check (wins between 0 and 20),
  decision_elo integer not null default 0,
  exercise_elo integer not null default 0,
  chess_title text not null default '' check (chess_title in ('', 'FM', 'IM', 'GM')),
  decision_positive smallint not null default 0,
  decision_total smallint not null default 0,
  exercise_total smallint not null default 0,
  max_elo integer not null default 600,
  max_level smallint not null default 0,
  event_history text[] not null default '{}',
  events_done smallint[] not null default '{}',
  current_event_id text,
  season_answers boolean[] not null default '{}',
  current_exercise_id text,
  exercise_attempts smallint not null default 3 check (exercise_attempts between 0 and 3),
  exercise_step smallint not null default 0 check (exercise_step >= 0),
  version integer not null default 1,
  client_version text not null default '1.2.0',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists gambito_sessions_visitor_created_idx
  on public.gambito_sessions(visitor_id, created_at desc);

create table if not exists public.gambito_results (
  id bigint generated always as identity primary key,
  session_id uuid not null unique references public.gambito_sessions(id) on delete cascade,
  visitor_id uuid not null references public.gambito_visitors(id) on delete cascade,
  player_name text not null,
  final_elo integer not null,
  max_elo integer not null,
  final_level smallint not null,
  max_level smallint not null,
  chess_title text not null default '',
  decision_positive smallint not null,
  decision_total smallint not null,
  exercise_positive smallint not null,
  exercise_total smallint not null,
  client_version text not null,
  completed_at timestamptz not null default now()
);

create index if not exists gambito_results_ranking_idx
  on public.gambito_results(max_elo desc, max_level desc, exercise_positive desc, completed_at asc);
create index if not exists gambito_results_visitor_idx
  on public.gambito_results(visitor_id, max_elo desc);

alter table public.gambito_visitors enable row level security;
alter table public.gambito_participants enable row level security;
alter table public.gambito_sessions enable row level security;
alter table public.gambito_results enable row level security;

-- No browser-facing policies are created. Every write and aggregate read goes
-- through the Edge Function, which validates the browser's random token and uses
-- the service role internally. The service role bypasses RLS.

create or replace function public.gambito_register_start(p_visitor_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.gambito_participants(visitor_id, careers_started)
  values (p_visitor_id, 1)
  on conflict (visitor_id) do update
    set careers_started = public.gambito_participants.careers_started + 1,
        last_seen_at = now();
$$;

revoke all on function public.gambito_register_start(uuid) from public, anon, authenticated;

create or replace function public.gambito_complete_participant(p_visitor_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.gambito_participants
     set careers_completed = careers_completed + 1,
         last_seen_at = now()
   where visitor_id = p_visitor_id;
$$;

revoke all on function public.gambito_complete_participant(uuid) from public, anon, authenticated;

create or replace function public.gambito_finalize_result(p_session_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  inserted_rows integer := 0;
  participant_id uuid;
begin
  insert into public.gambito_results(
    session_id, visitor_id, player_name, final_elo, max_elo,
    final_level, max_level, chess_title,
    decision_positive, decision_total,
    exercise_positive, exercise_total, client_version, completed_at
  )
  select
    s.id, s.visitor_id,
    concat(case when s.chess_title = '' then '' else s.chess_title || ' ' end, s.player_name),
    (array[600,800,1200,1400,1600,2000,2200,2350,2500,2600,2750])[s.level + 1]
      + s.decision_elo + s.exercise_elo,
    s.max_elo, s.level, s.max_level, s.chess_title,
    s.decision_positive, s.decision_total,
    s.wins, s.exercise_total, s.client_version, s.completed_at
  from public.gambito_sessions s
  where s.id = p_session_id and s.completed_at is not null and not s.debug
  on conflict (session_id) do nothing;

  get diagnostics inserted_rows = row_count;
  if inserted_rows = 1 then
    select visitor_id into participant_id from public.gambito_sessions where id = p_session_id;
    update public.gambito_participants
       set careers_completed = careers_completed + 1,
           last_seen_at = now()
     where visitor_id = participant_id;
  end if;
  return inserted_rows = 1;
end;
$$;

revoke all on function public.gambito_finalize_result(uuid) from public, anon, authenticated;

create or replace function public.gambito_public_stats(p_visitor_id uuid)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  with personal_best as (
    select distinct on (r.visitor_id)
      r.visitor_id, r.player_name, r.max_elo, r.max_level,
      r.decision_positive, r.decision_total,
      r.exercise_positive, r.exercise_total, r.completed_at
    from public.gambito_results r
    order by r.visitor_id, r.max_elo desc, r.max_level desc,
             r.exercise_positive desc, r.completed_at asc
  ),
  ranked as (
    select pb.*,
      row_number() over (
        order by pb.max_elo desc, pb.max_level desc,
                 pb.exercise_positive desc, pb.completed_at asc
      )::integer as position,
      count(*) over ()::integer as ranked_players
    from personal_best pb
  ),
  top_ten as (
    select coalesce(jsonb_agg(jsonb_build_object(
      'name', player_name,
      'elo', max_elo,
      'level', max_level,
      'decisionPositive', decision_positive,
      'decisionTotal', decision_total,
      'exercisePositive', exercise_positive,
      'exerciseTotal', exercise_total,
      'position', position
    ) order by position), '[]'::jsonb) as rows
    from (select * from ranked order by position limit 10) leaderboard
  ),
  histogram as (
    select coalesce(jsonb_agg(jsonb_build_object(
      'min', bucket_min,
      'max', bucket_min + 199,
      'count', bucket_count
    ) order by bucket_min), '[]'::jsonb) as bins
    from (
      select (floor(greatest(max_elo, 0) / 200.0) * 200)::integer as bucket_min,
             count(*)::integer as bucket_count
      from ranked
      group by 1
    ) grouped
  ),
  current_player as (
    select jsonb_build_object(
      'name', player_name,
      'elo', max_elo,
      'level', max_level,
      'decisionPositive', decision_positive,
      'decisionTotal', decision_total,
      'exercisePositive', exercise_positive,
      'exerciseTotal', exercise_total,
      'position', position,
      'rankedPlayers', ranked_players,
      'percentile', case
        when ranked_players <= 1 then 100
        else round(((ranked_players - position)::numeric / (ranked_players - 1)) * 100, 1)
      end
    ) as row
    from ranked
    where visitor_id = p_visitor_id
  )
  select jsonb_build_object(
    'participants', (select count(*)::integer from public.gambito_participants),
    'completedCareers', (select count(*)::integer from public.gambito_results),
    'rankedPlayers', (select count(*)::integer from ranked),
    'leaderboard', (select rows from top_ten),
    'histogram', (select bins from histogram),
    'currentPlayer', coalesce((select row from current_player), 'null'::jsonb)
  );
$$;

revoke all on function public.gambito_public_stats(uuid) from public, anon, authenticated;
