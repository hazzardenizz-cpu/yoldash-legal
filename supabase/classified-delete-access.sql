-- Delete permissions for both app and web: publisher or SUPER_ADMIN only.
alter policy driver_hub_owner_delete on public.driver_hub_listings
  to authenticated
  using ((select auth.uid()) = user_id or public.yoldash_is_super_admin((select auth.uid())));
