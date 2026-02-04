-- ============================================
-- FIX: Atualizar função is_diretora para incluir super_admin
-- Grand Salto SaaS
-- ============================================

-- A função original só verificava role = 'diretora'
-- Isso causava problemas de RLS para usuários super_admin
-- que podiam passar pela validação do código mas não pela policy do banco

-- Atualizar a função para incluir super_admin
create or replace function public.is_diretora() returns boolean as $$
begin
  return exists (
    select 1 from public.perfis
    where id = auth.uid()
    and role in ('diretora', 'super_admin')
  );
end;
$$ language plpgsql security definer;

-- Verificar a atualização
select 'Função is_diretora atualizada com sucesso!' as status;
