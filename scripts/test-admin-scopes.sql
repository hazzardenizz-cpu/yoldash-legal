do $test$
declare chat_uid uuid:=gen_random_uuid();cargo_uid uuid:=gen_random_uuid();normal_uid uuid:=gen_random_uuid(); denied boolean;
begin
 begin
  insert into auth.users(id,email,raw_user_meta_data,raw_app_meta_data,aud,role,created_at,updated_at) values
   (chat_uid,'qa-scope-chat-'||chat_uid||'@example.invalid','{"business_user_type":"DRIVER"}','{}','authenticated','authenticated',now(),now()),
   (cargo_uid,'qa-scope-cargo-'||cargo_uid||'@example.invalid','{"business_user_type":"DRIVER"}','{}','authenticated','authenticated',now(),now()),
   (normal_uid,'qa-scope-user-'||normal_uid||'@example.invalid','{"business_user_type":"DRIVER"}','{}','authenticated','authenticated',now(),now());
  insert into public.user_roles(user_id,role) values(chat_uid,'ADMIN'),(cargo_uid,'ADMIN') on conflict do nothing;
  insert into public.admin_scope_assignments(user_id,scope) values(chat_uid,'CHAT'),(cargo_uid,'CARGO');
  perform set_config('request.jwt.claim.sub',chat_uid::text,true);
  perform set_config('role','authenticated',true);
  if not public.yoldash_is_chat_admin() or public.yoldash_is_cargo_admin() or public.is_admin() then raise exception 'CHAT scope leaks cargo/general authority'; end if;
  if exists(select 1 from public.profiles where id=normal_uid) then raise exception 'CHAT admin can read unrelated private profile'; end if;
  denied:=false;begin perform public.super_admin_set_super_admin(normal_uid,true);exception when others then denied:=true;end;
  if not denied then raise exception 'CHAT admin can grant SUPER_ADMIN';end if;
  denied:=false;begin perform public.get_super_admin_user_map();exception when insufficient_privilege then denied:=true;end;
  if not denied then raise exception 'CHAT admin can read super admin map';end if;
  perform set_config('request.jwt.claim.sub',cargo_uid::text,true);
  if not public.yoldash_is_cargo_admin() or public.yoldash_is_chat_admin() or public.is_admin() then raise exception 'CARGO scope leaks chat/general authority'; end if;
  perform set_config('request.jwt.claim.sub',normal_uid::text,true);
  if public.yoldash_is_cargo_admin() or public.yoldash_is_chat_admin() or public.is_admin() then raise exception 'Ordinary user has admin access';end if;
  denied:=false;begin perform public.set_chat_admin(normal_uid,true);exception when insufficient_privilege then denied:=true;end;
  if not denied then raise exception 'Ordinary user can grant chat admin';end if;
  raise exception using errcode='ZX001',message='Rollback all scope-test fixtures';
 exception when sqlstate 'ZX001' then null;
 end;
 if exists(select 1 from auth.users where id in(chat_uid,cargo_uid,normal_uid)) then raise exception 'Scope fixtures remain';end if;
end $test$;
