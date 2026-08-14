-- La finalización se registra únicamente con gambito_finalize_result, que
-- comprueba que la sesión haya terminado y evita duplicados por session_id.
drop function if exists public.gambito_complete_participant(uuid);
