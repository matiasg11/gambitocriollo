-- Elimina solamente el lote ficticio del ranking. Las FK borran en cascada
-- las sesiones, los resultados y los participantes asociados.
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
