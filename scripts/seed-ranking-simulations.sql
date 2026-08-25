-- Crea 2.000 carreras ficticias para probar ranking e histograma.
-- Todas quedan identificadas con client_version = 'simulation-ranking-v2'.
-- Es seguro ejecutar este archivo nuevamente: primero reemplaza el lote previo.
begin;

delete from public.gambito_visitors v
where exists (
  select 1
  from public.gambito_sessions s
  where s.visitor_id = v.id
    and (
      s.client_version like 'simulation-ranking-v%'
      or (
        s.version = 1
        and s.client_version = '1.7.0'
        and s.exercise_total = 20
        and s.decision_total = 11
        and s.completed_at is not null
        and extract(minute from s.completed_at) = 48
        and extract(second from s.completed_at) = 9.721947
      )
    )
) or exists (
  select 1
  from generate_series(1, 5000) player_number
  where v.id = (
    substr(md5('simulation-ranking-v1:visitor:' || player_number), 1, 8) || '-' ||
    substr(md5('simulation-ranking-v1:visitor:' || player_number), 9, 4) || '-' ||
    substr(md5('simulation-ranking-v1:visitor:' || player_number), 13, 4) || '-' ||
    substr(md5('simulation-ranking-v1:visitor:' || player_number), 17, 4) || '-' ||
    substr(md5('simulation-ranking-v1:visitor:' || player_number), 21, 12)
  )::uuid
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
  skill numeric;
  level_number integer;
  peak_level integer;
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
  elo_floors integer[] := array[600,800,1000,1200,1400,1750,1900,2100,2300,2400];
  elo_ceilings integer[] := array[2300,2350,2400,2450,2500,2550,2600,2650,2700,2750];
  first_names text[] := array[
    'Juan','María','Martín','Sofía','Nicolás','Valentina','Santiago','Camila',
    'Mateo','Lucía','Joaquín','Martina','Tomás','Julieta','Lucas','Agustina',
    'Agustín','Victoria','Francisco','Paula','Facundo','Carla','Gonzalo','Florencia',
    'Federico','Rocío','Diego','Micaela','Pablo','Daniela','Leandro','Mariana',
    'Sebastián','Natalia','Andrés','Cecilia','Mariano','Belén','Gabriel','Laura'
  ];
  last_names text[] := array[
    'González','López','Martínez','Pérez','García',
    'Sánchez','Romero','Díaz','Torres','Álvarez',
    'Ruiz','Ramírez','Flores','Benítez','Acosta',
    'Medina','Herrera','Suárez','Aguirre','Giménez',
    'Pereyra','Rojas','Molina','Castro','Ortiz'
  ];
  simulated_name text;
  visitor_uuid uuid;
  session_uuid uuid;
begin
  for player_number in 1..2000 loop
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

      exercise_chance := least(96, greatest(8,
        round(16 + skill * 84 - greatest(level_number - 5, 0) * 2)::integer
      ));

      exercise_roll := abs(hashtextextended(
        'exercise-v2:' || player_number || ':' || season_number, 41
      )) % 100;
      if exercise_roll < exercise_chance then
        exercise_positive_count := exercise_positive_count + 1;
        attempt_roll := abs(hashtextextended(
          'attempt-v2:' || player_number || ':' || season_number, 43
        )) % 100;
        if attempt_roll < round(35 + skill * 45) then
          exercise_points := exercise_points + 8;
        elsif attempt_roll < round(75 + skill * 18) then
          exercise_points := exercise_points + 4;
        else
          exercise_points := exercise_points + 2;
        end if;
        level_number := least(10, level_number + 1);
      end if;

      peak_level := greatest(peak_level, level_number);
      current_elo := greatest(
        elo_floors[level_number],
        least(elo_ceilings[level_number], elo_floors[level_number] + decision_points + exercise_points)
      );
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
    simulated_name := first_names[((player_number - 1) % array_length(first_names, 1)) + 1]
      || ' ' || last_names[(((player_number - 1) / array_length(first_names, 1)) % array_length(last_names, 1)) + 1];

    insert into gambito_simulated_careers values (
      visitor_uuid,
      session_uuid,
      simulated_name,
      greatest(
        elo_floors[level_number],
        least(elo_ceilings[level_number], elo_floors[level_number] + decision_points + exercise_points)
      ),
      peak_elo,
      level_number,
      peak_level,
      earned_title,
      decision_positive_count,
      decision_points,
      exercise_positive_count,
      exercise_points,
      now() - ((2001 - player_number) || ' minutes')::interval
    );
  end loop;
end;
$$;

insert into public.gambito_visitors(id, token_hash, created_at, last_seen_at)
select visitor_id,
       encode(digest('simulation-ranking-v2:' || visitor_id::text, 'sha256'), 'hex'),
       completed_at - interval '10 days',
       completed_at
from gambito_simulated_careers;

insert into public.gambito_participants(
  visitor_id, first_seen_at, last_seen_at, careers_started, careers_completed
)
select visitor_id, completed_at - interval '10 days', completed_at, 1, 1
from gambito_simulated_careers;

insert into public.gambito_sessions(
  id, visitor_id, player_name, country_code, debug, season, level, wins,
  decision_elo, exercise_elo, chess_title,
  decision_positive, decision_total, exercise_total,
  max_elo, max_level, events_done, exercise_attempts, exercise_step,
  version, client_version, current_elo, created_at, updated_at, completed_at
)
select
  session_id, visitor_id, player_name, 'AR', false, 11, final_level, exercise_positive,
  decision_elo, exercise_elo, chess_title,
  decision_positive, 10, 10,
  max_elo, max_level, array[1,2,3,4,5,6,7,8,9,10]::smallint[], 3, 0,
  42, 'simulation-ranking-v2', final_elo,
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
  decision_positive, 10, exercise_positive, 10,
  'simulation-ranking-v2', completed_at
from gambito_simulated_careers;

commit;
