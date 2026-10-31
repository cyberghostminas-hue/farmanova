-- Pega este script en Supabase > SQL Editor > Run
create table pedidos(
  id text primary key,
  nombre text not null check (char_length(nombre) between 2 and 120),
  telefono text not null check (char_length(telefono) between 6 and 30),
  direccion text not null check (char_length(direccion) between 3 and 300),
  notas text check (char_length(notas) <= 500),
  pago text not null check (pago in ('WhatsApp','Transfermóvil')),
  items jsonb not null,
  subtotal numeric not null, envio numeric not null, total numeric not null,
  requiere_receta boolean not null default false,
  consentimiento boolean not null check (consentimiento),
  estado text not null default 'nuevo',   -- nuevo, pagado, enviado, entregado, cancelado
  created_at timestamptz not null default now()
);
alter table pedidos enable row level security;
-- Los visitantes solo pueden CREAR pedidos; nadie puede leerlos ni modificarlos desde la web.
revoke all on pedidos from anon, authenticated;
grant insert on pedidos to anon;
create policy "crear pedidos" on pedidos for insert to anon with check (estado = 'nuevo');
-- Vista de clientes (solo visible para ti en el panel de Supabase)
create view clientes with (security_invoker = true) as
  select distinct on (telefono) telefono, nombre, direccion,
         created_at as ultimo_pedido, count(*) over (partition by telefono) as pedidos
  from pedidos order by telefono, created_at desc;
revoke all on clientes from anon, authenticated;
