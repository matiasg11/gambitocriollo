begin;

-- Las carreras pasan a usar únicamente niveles 1–10.
alter table public.gambito_sessions
  drop constraint if exists gambito_sessions_level_check;

update public.gambito_sessions
   set level = greatest(level, 1),
       max_level = greatest(max_level, 1),
       client_version = case when completed_at is null then '1.3.0' else client_version end
 where level < 1 or max_level < 1 or (completed_at is null and client_version <> '1.3.0');

alter table public.gambito_sessions
  alter column level set default 1,
  alter column max_level set default 1,
  add column if not exists current_elo integer not null default 600,
  add constraint gambito_sessions_level_check check (level between 1 and 10),
  add constraint gambito_sessions_max_level_check check (max_level between 1 and 10);

-- La función Edge escribe el ELO actual ya validado. De este modo los pisos se
-- editan solamente en game-config.js y no quedan duplicados en una función SQL.
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

commit;
