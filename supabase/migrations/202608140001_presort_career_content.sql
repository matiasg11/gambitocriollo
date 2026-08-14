begin;

-- Cada carrera nueva guarda su propio presorteo. Los objetos del catálogo se
-- resuelven por ID para que editar uno no altere el resto de la partida.
alter table public.gambito_sessions
  add column if not exists content_draw jsonb not null default '{}'::jsonb;

alter table public.gambito_sessions
  drop constraint if exists gambito_sessions_content_draw_object_check;

alter table public.gambito_sessions
  add constraint gambito_sessions_content_draw_object_check
  check (jsonb_typeof(content_draw) = 'object');

comment on column public.gambito_sessions.content_draw is
  'Presorteo versionado de ejercicios y dilemas por combinación temporada:nivel.';

commit;
