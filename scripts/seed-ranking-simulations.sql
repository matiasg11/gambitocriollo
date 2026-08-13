-- Crea 1.000 carreras ficticias para probar ranking e histograma.
-- Todas quedan identificadas con client_version = 'simulation-ranking-v1'.
-- Es seguro ejecutar este archivo nuevamente: primero reemplaza el lote previo.
begin;

delete from public.gambito_visitors v
where exists (
  select 1
  from public.gambito_sessions s
  where s.visitor_id = v.id
    and s.client_version = 'simulation-ranking-v1'
);

create temporary table gambito_simulated_careers (
  visitor_id uuid primary key,
  session_id uuid not null,
  player_name text not null,
  final_elo integer not null,
  max_elo integer not null,
  final_level smallint not null,
  max_level smallint not null,
  chess_title text not null,
  decision_positive smallint not null,
  decision_elo integer not null,
  exercise_positive smallint not null,
  exercise_elo integer not null,
  completed_at timestamptz not null
) on commit drop;

do $$
declare
  player_number integer;
  season_number integer;
  exercise_number integer;
  skill numeric;
  level_number integer;
  peak_level integer;
  correct_in_season integer;
  exercise_roll integer;
  attempt_roll integer;
  decision_roll integer;
  decision_chance integer;
  exercise_chance integer;
  decision_positive_count integer;
  exercise_positive_count integer;
  decision_points integer;
  exercise_points integer;
  current_elo integer;
  peak_elo integer;
  earned_title text;
  elo_floors integer[] := array[600,800,1000,1200,1400,1600,1800,1900,2000,2200];
  visitor_uuid uuid;
  session_uuid uuid;
begin
  for player_number in 1..1000 loop
    skill := (abs(hashtextextended('skill:' || player_number, 17)) % 1001)::numeric / 1000;
    level_number := 1;
    peak_level := 1;
    decision_positive_count := 0;
    exercise_positive_count := 0;
    decision_points := 0;
    exercise_points := 0;
    peak_elo := elo_floors[1];

    for season_number in 1..10 loop
      decision_chance := least(93, greatest(42, round(48 + skill * 42)::integer));
      decision_roll := abs(hashtextextended('decision:' || player_number || ':' || season_number, 29)) % 100;
      if decision_roll < decision_chance then
        decision_positive_count := decision_positive_count + 1;
        decision_points := decision_points
          + 10 + (abs(hashtextextended('decision-points:' || player_number || ':' || season_number, 31)) % 51);
      else
        decision_points := decision_points
          - 5 - (abs(hashtextextended('decision-loss:' || player_number || ':' || season_number, 37)) % 27);
      end if;

      correct_in_season := 0;
      exercise_chance := least(96, greatest(8,
        round(16 + skill * 84 - greatest(level_number - 5, 0) * 2)::integer
      ));

      for exercise_number in 1..2 loop
        exercise_roll := abs(hashtextextended(
          'exercise:' || player_number || ':' || season_number || ':' || exercise_number, 41
        )) % 100;
        if exercise_roll < exercise_chance then
          correct_in_season := correct_in_season + 1;
          exercise_positive_count := exercise_positive_count + 1;
          attempt_roll := abs(hashtextextended(
            'attempt:' || player_number || ':' || season_number || ':' || exercise_number, 43
          )) % 100;
          if attempt_roll < round(35 + skill * 45) then
            exercise_points := exercise_points + 12;
          elsif attempt_roll < round(75 + skill * 18) then
            exercise_points := exercise_points + 6;
          else
            exercise_points := exercise_points + 3;
          end if;
        end if;
      end loop;

      if correct_in_season = 2 then
        level_number := least(10, level_number + 1);
      elsif correct_in_season = 0 then
        level_number := greatest(1, level_number - 1);
      end if;

      peak_level := greatest(peak_level, level_number);
      current_elo := elo_floors[level_number] + decision_points + exercise_points;
      peak_elo := greatest(peak_elo, current_elo);
    end loop;

    earned_title := case
      when peak_elo > 2500 then 'GM'
      when peak_elo > 2400 then 'IM'
      when peak_elo > 2300 then 'FM'
      else ''
    end;
    visitor_uuid := (
      substr(md5('simulation-ranking-v1:visitor:' || player_number), 1, 8) || '-' ||
      substr(md5('simulation-ranking-v1:visitor:' || player_number), 9, 4) || '-' ||
      substr(md5('simulation-ranking-v1:visitor:' || player_number), 13, 4) || '-' ||
      substr(md5('simulation-ranking-v1:visitor:' || player_number), 17, 4) || '-' ||
      substr(md5('simulation-ranking-v1:visitor:' || player_number), 21, 12)
    )::uuid;
    session_uuid := (
      substr(md5('simulation-ranking-v1:session:' || player_number), 1, 8) || '-' ||
      substr(md5('simulation-ranking-v1:session:' || player_number), 9, 4) || '-' ||
      substr(md5('simulation-ranking-v1:session:' || player_number), 13, 4) || '-' ||
      substr(md5('simulation-ranking-v1:session:' || player_number), 17, 4) || '-' ||
      substr(md5('simulation-ranking-v1:session:' || player_number), 21, 12)
    )::uuid;

    insert into gambito_simulated_careers values (
      visitor_uuid,
      session_uuid,
      'SIM-' || lpad(player_number::text, 4, '0'),
      elo_floors[level_number] + decision_points + exercise_points,
      peak_elo,
      level_number,
      peak_level,
      earned_title,
      decision_positive_count,
      decision_points,
      exercise_positive_count,
      exercise_points,
      now() - ((1001 - player_number) || ' minutes')::interval
    );
  end loop;
end;
$$;

insert into public.gambito_visitors(id, token_hash, created_at, last_seen_at)
select visitor_id,
       encode(digest('simulation-ranking-v1:' || visitor_id::text, 'sha256'), 'hex'),
       completed_at - interval '10 days',
       completed_at
from gambito_simulated_careers;

insert into public.gambito_participants(
  visitor_id, first_seen_at, last_seen_at, careers_started, careers_completed
)
select visitor_id, completed_at - interval '10 days', completed_at, 1, 1
from gambito_simulated_careers;

insert into public.gambito_sessions(
  id, visitor_id, player_name, debug, season, level, wins,
  decision_elo, exercise_elo, chess_title,
  decision_positive, decision_total, exercise_total,
  max_elo, max_level, events_done, exercise_attempts, exercise_step,
  version, client_version, current_elo, created_at, updated_at, completed_at
)
select
  session_id, visitor_id, player_name, false, 11, final_level, exercise_positive,
  decision_elo, exercise_elo, chess_title,
  decision_positive, 10, 20,
  max_elo, max_level, array[1,2,3,4,5,6,7,8,9,10]::smallint[], 3, 0,
  42, 'simulation-ranking-v1', final_elo,
  completed_at - interval '10 days', completed_at, completed_at
from gambito_simulated_careers;

insert into public.gambito_results(
  session_id, visitor_id, player_name, final_elo, max_elo,
  final_level, max_level, chess_title,
  decision_positive, decision_total,
  exercise_positive, exercise_total, client_version, completed_at
)
select
  session_id, visitor_id,
  concat(case when chess_title = '' then '' else chess_title || ' ' end, player_name),
  final_elo, max_elo, final_level, max_level, chess_title,
  decision_positive, 10, exercise_positive, 20,
  'simulation-ranking-v1', completed_at
from gambito_simulated_careers;

commit;
