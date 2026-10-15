-- Transactional integration test. The success marker rolls back all fixtures,
-- messages, notifications and queued side effects. No test accounts are kept.
do $test$
declare owner_uid uuid:=gen_random_uuid(); driver_uid uuid:=gen_random_uuid(); stranger_uid uuid:=gen_random_uuid(); cargo_uid uuid; assignment_uid uuid; offer_uid uuid; room_uid uuid; rejected boolean:=false; n integer;
begin
 begin
  insert into auth.users(id,email,raw_user_meta_data,raw_app_meta_data,aud,role,created_at,updated_at) values
   (owner_uid,'qa-owner-'||owner_uid||'@example.invalid','{"business_user_type":"CARGO_OWNER"}','{}','authenticated','authenticated',now(),now()),
   (driver_uid,'qa-driver-'||driver_uid||'@example.invalid','{"business_user_type":"DRIVER"}','{}','authenticated','authenticated',now(),now()),
   (stranger_uid,'qa-stranger-'||stranger_uid||'@example.invalid','{"business_user_type":"DRIVER"}','{}','authenticated','authenticated',now(),now());
  insert into public.cargo_owner_profiles(user_id,organization_name) values(owner_uid,'Yoldash transaction QA');
  update public.profiles set first_name='Transaction',last_name='QA',phone='+900000000000',whatsapp_phone='+900000000000',tractor_transit_plate='QATEST',container_transit_plate='QATEST' where id=driver_uid;
  perform set_config('request.jwt.claim.sub',owner_uid::text,true);
  perform set_config('role','authenticated',true);
  insert into public.cargo_posts(status,cargo_type,required_truck_type,origin_country_code,origin_city,destination_country_code,destination_city,truck_count,loading_at,freight_price,currency_code)
    values('PUBLISHED','TRANSACTION QA','CURTAIN','TR','Istanbul','IR','Tehran',2,now()+interval '5 minutes',100,'USD') returning id into cargo_uid;
  update public.cargo_posts set description='QA edit' where id=cargo_uid;
  if not exists(select 1 from public.cargo_posts where id=cargo_uid and description='QA edit') then raise exception 'Owner edit failed'; end if;
  update public.cargo_posts set deleted_at=now() where id=cargo_uid;
  if not exists(select 1 from public.cargo_posts where id=cargo_uid and deleted_at is not null) then raise exception 'Unassigned own cargo deletion failed'; end if;
  update public.cargo_posts set deleted_at=null where id=cargo_uid;
  perform set_config('request.jwt.claim.sub',driver_uid::text,true);
  select id into offer_uid from public.submit_cargo_offer(cargo_uid,110,'USD','QA request',1);
  if offer_uid is null then raise exception 'Offer submission failed'; end if;
  select count(*) into n from public.get_cargo_offer_snapshot(cargo_uid) where offer_id=offer_uid and offer_status='PENDING';
  if n<>1 then raise exception 'Provider pending offer missing'; end if;
  perform set_config('request.jwt.claim.sub',stranger_uid::text,true);
  update public.cargo_posts set description='UNAUTHORIZED' where id=cargo_uid;
  if found then raise exception 'Stranger modified owner cargo'; end if;
  begin perform public.set_cargo_offer_status(offer_uid,'ACCEPTED'); exception when insufficient_privilege then rejected:=true; end;
  if not rejected then raise exception 'Stranger could accept offer'; end if;
  perform set_config('request.jwt.claim.sub',owner_uid::text,true);
  perform public.set_cargo_offer_status(offer_uid,'ACCEPTED');
  select id into room_uid from public.get_shipment_room_for_offer(offer_uid);
  if room_uid is null then raise exception 'Accepted offer has no chat room'; end if;
  perform public.send_shipment_message(room_uid,'TEXT','QA private message');
  perform set_config('request.jwt.claim.sub',driver_uid::text,true);
  select count(*) into n from public.get_shipment_messages(room_uid,100) where body='QA private message';
  if n<>1 then raise exception 'Driver cannot read accepted chat'; end if;
  perform set_config('request.jwt.claim.sub',stranger_uid::text,true);
  select count(*) into n from public.get_shipment_messages(room_uid,100);
  if n<>0 then raise exception 'Stranger can read private chat'; end if;
  perform set_config('request.jwt.claim.sub',owner_uid::text,true);
  rejected:=false;
  begin
    update public.cargo_posts set deleted_at=now() where id=cargo_uid;
  exception when invalid_parameter_value then
    if sqlerrm<>'cargo_has_transport_history' then raise; end if;
    rejected:=true;
  end;
  if not rejected then raise exception 'Assigned cargo can still be deleted'; end if;
  select assignment_id into assignment_uid from public.get_shipment_room_for_offer(offer_uid);
  perform public.advance_shipment_assignment_status(assignment_uid,'SELECTED',null);
  rejected:=false;
  begin perform public.advance_shipment_assignment_status(assignment_uid,'SELECTED',null);
  exception when sqlstate 'PT409' then rejected:=true;end;
  if not rejected then raise exception 'Stale stage update was accepted';end if;
  rejected:=false;
  begin perform public.advance_shipment_assignment_status(assignment_uid,'ASSIGNED',null);
  exception when insufficient_privilege then rejected:=true;end;
  if not rejected then raise exception 'Owner can advance driver-only stage';end if;
  perform set_config('request.jwt.claim.sub',driver_uid::text,true);
  perform public.advance_shipment_assignment_status(assignment_uid,'ASSIGNED',null);
  perform public.advance_shipment_assignment_status(assignment_uid,'PICKUP',null);
  perform public.advance_shipment_assignment_status(assignment_uid,'IN_TRANSIT',null);
  perform public.advance_shipment_assignment_status(assignment_uid,'BORDER_CUSTOMS',null);
  rejected:=false;
  begin perform public.advance_shipment_assignment_status(assignment_uid,'DELIVERED',null);
  exception when insufficient_privilege then rejected:=true;end;
  if not rejected then raise exception 'Driver can confirm final delivery instead of owner';end if;
  perform set_config('request.jwt.claim.sub',owner_uid::text,true);
  perform public.advance_shipment_assignment_status(assignment_uid,'DELIVERED',null);
  select count(*) into n from public.get_assignment_status_history(assignment_uid);
  if n<6 then raise exception 'Shipment history is incomplete';end if;
  perform set_config('request.jwt.claim.sub',stranger_uid::text,true);
  select count(*) into n from public.get_assignment_status_history(assignment_uid);
  if n<>0 then raise exception 'Stranger can read shipment history';end if;
  raise exception using errcode='ZX001',message='QA complete: roll back every fixture and queued side effect';
 exception when sqlstate 'ZX001' then null;
 end;
 if exists(select 1 from auth.users where id in(owner_uid,driver_uid,stranger_uid)) then raise exception 'QA fixtures were not rolled back'; end if;
end $test$;
