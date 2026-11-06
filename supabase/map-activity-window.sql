-- Applied to the shared map RPC: retain its Super Admin guard and return shape.
DO $$
DECLARE definition text;
BEGIN
  SELECT pg_get_functiondef('public.get_super_admin_user_map()'::regprocedure) INTO definition;
  IF position('where r.rn = 1' in definition) = 0 THEN
    RAISE EXCEPTION 'Unexpected map function definition';
  END IF;
  IF position('r.location_updated_at >= now()' in definition) = 0 THEN
    definition := replace(definition, 'where r.rn = 1',
      'where r.rn = 1 and r.location_updated_at >= now() - interval ''60 minutes'' and r.location_updated_at <= now()');
    EXECUTE definition;
  END IF;
END $$;
