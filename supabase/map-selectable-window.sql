DO $$
DECLARE definition text;
BEGIN
 SELECT pg_get_functiondef('public.get_super_admin_user_map()'::regprocedure) INTO definition;
 IF position('r.location_updated_at >= now() - interval ''60 minutes''' in definition)=0 THEN RAISE EXCEPTION 'Unexpected map function'; END IF;
 definition := replace(definition, 'public.get_super_admin_user_map()', 'public.get_super_admin_user_map_window(p_minutes integer DEFAULT 60)');
 definition := replace(definition, 'r.location_updated_at >= now() - interval ''60 minutes''', '(p_minutes = 0 OR r.location_updated_at >= now() - make_interval(mins => p_minutes))');
 definition := replace(definition, '  return query', '  if p_minutes is null or p_minutes not in (0,15,30,60,120,360,720,1440,10080,43200) then raise exception ''INVALID_MAP_WINDOW'' using errcode=''22023''; end if;
  return query');
 EXECUTE definition;
END $$;
REVOKE ALL ON FUNCTION public.get_super_admin_user_map_window(integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_super_admin_user_map_window(integer) TO authenticated;
NOTIFY pgrst, 'reload schema';
