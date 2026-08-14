begin;

-- Limpia únicamente los resultados históricos fuera de la nueva escala.
-- Las carreras y los participantes se conservan.
delete from public.gambito_results
where max_elo > 2650;

commit;
