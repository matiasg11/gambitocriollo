begin;

alter table public.gambito_sessions
  add column if not exists cheating_accepted boolean not null default false;

comment on column public.gambito_sessions.cheating_accepted is
  'Marca permanente: aceptar asistencia ilegal limita el nivel máximo de la carrera a 6.';

commit;
