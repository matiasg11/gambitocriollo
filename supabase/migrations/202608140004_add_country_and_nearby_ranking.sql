begin;

alter table public.gambito_sessions
  add column if not exists country_code text;

alter table public.gambito_results
  add column if not exists country_code text;

alter table public.gambito_sessions
  drop constraint if exists gambito_sessions_country_code_check,
  add constraint gambito_sessions_country_code_check
    check (country_code is null or country_code ~ '^[A-Z]{2}$');

alter table public.gambito_results
  drop constraint if exists gambito_results_country_code_check,
  add constraint gambito_results_country_code_check
    check (country_code is null or country_code ~ '^[A-Z]{2}$');

-- El lote de prueba usa nombres argentinos y queda identificado explícitamente.
update public.gambito_sessions
   set country_code = 'AR'
 where client_version = 'simulation-ranking-v1' and country_code is null;
update public.gambito_results
   set country_code = 'AR'
 where client_version = 'simulation-ranking-v1' and country_code is null;

comment on column public.gambito_sessions.country_code is
  'Código ISO 3166-1 alfa-2 del país representado por el jugador.';
comment on column public.gambito_results.country_code is
  'Código ISO 3166-1 alfa-2 conservado en el resultado clasificado.';

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
    session_id, visitor_id, player_name, country_code, final_elo, max_elo,
    final_level, max_level, chess_title,
    decision_positive, decision_total,
    exercise_positive, exercise_total, client_version, completed_at
  )
  select
    s.id, s.visitor_id,
    concat(case when s.chess_title = '' then '' else s.chess_title || ' ' end, s.player_name),
    s.country_code,
    s.current_elo, s.max_elo, s.level, s.max_level, s.chess_title,
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
      r.visitor_id, r.player_name, r.country_code, r.max_elo, r.max_level,
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
  own_position as (
    select position from ranked where visitor_id = p_visitor_id
  ),
  top_ten as (
    select coalesce(jsonb_agg(jsonb_build_object(
      'name', player_name,
      'countryCode', country_code,
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
  nearby_players as (
    select coalesce(jsonb_agg(jsonb_build_object(
      'name', player_name,
      'countryCode', country_code,
      'elo', max_elo,
      'level', max_level,
      'decisionPositive', decision_positive,
      'decisionTotal', decision_total,
      'exercisePositive', exercise_positive,
      'exerciseTotal', exercise_total,
      'position', position
    ) order by position), '[]'::jsonb) as rows
    from ranked
    where position between
      greatest(1, coalesce((select position from own_position), 0) - 2)
      and coalesce((select position from own_position), -10) + 2
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
      'countryCode', country_code,
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
    'nearby', (select rows from nearby_players),
    'histogram', (select bins from histogram),
    'currentPlayer', coalesce((select row from current_player), 'null'::jsonb)
  );
$$;

revoke all on function public.gambito_public_stats(uuid) from public, anon, authenticated;

commit;
