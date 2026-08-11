-- ===========================================================================
-- In-app account deletion
--
-- App Store Review Guideline 5.1.1(v) requires any app that lets people create
-- an account to also let them delete it from inside the app. The anon key
-- cannot touch auth.users, so this runs as a SECURITY DEFINER function that
-- only ever deletes the *calling* user.
--
-- Every table in 0001_init.sql references auth.users(id) ON DELETE CASCADE,
-- so removing the auth row removes all of their data with it.
-- ===========================================================================

create or replace function public.delete_own_account()
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  caller uuid := auth.uid();
begin
  if caller is null then
    raise exception 'Not authenticated';
  end if;

  -- The cascade on each table's user_id foreign key clears the rest.
  delete from auth.users where id = caller;
end;
$$;

revoke all on function public.delete_own_account() from public;
grant execute on function public.delete_own_account() to authenticated;
