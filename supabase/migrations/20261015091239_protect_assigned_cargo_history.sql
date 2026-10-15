CREATE OR REPLACE FUNCTION public.protect_cargo_post_update()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
    -- Owner identity can never be changed by an ordinary update.
    if new.owner_id is distinct from old.owner_id
       or new.owner_business_type is distinct from old.owner_business_type
       or new.owner_display_name is distinct from old.owner_display_name
       or new.announced_at is distinct from old.announced_at
       or new.created_at is distinct from old.created_at then
        raise exception 'Cargo owner identity and announcement metadata are immutable'
            using errcode = '42501';
    end if;

    -- Transport history must survive; use cancellation workflows for assigned loads.
    if old.deleted_at is null and new.deleted_at is not null and (
        coalesce(old.accepted_truck_count,0) > 0
        or exists(select 1 from public.shipment_assignments a where a.cargo_id=old.id)
        or exists(select 1 from public.cargo_offers o where o.cargo_id=old.id and o.status='ACCEPTED')
    ) then
        raise exception 'cargo_has_transport_history' using errcode='22023';
    end if;

    new.updated_at := now();

    if new.status = 'PUBLISHED'::public.cargo_status
       and old.status is distinct from 'PUBLISHED'::public.cargo_status
       and new.published_at is null then
        new.published_at := now();
    end if;

    return new;
end;
$function$
