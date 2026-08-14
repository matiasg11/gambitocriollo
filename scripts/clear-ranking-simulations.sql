-- Elimina solamente el lote ficticio del ranking. Las FK borran en cascada
-- las sesiones, los resultados y los participantes asociados.
delete from public.gambito_visitors v
where exists (
  select 1
  from public.gambito_sessions s
  where s.visitor_id = v.id
    and s.client_version = 'simulation-ranking-v1'
);
