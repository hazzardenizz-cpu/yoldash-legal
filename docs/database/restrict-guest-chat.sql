-- Match the website's sign-in requirement without changing signed-in access.
revoke execute on function public.get_public_chat_messages(integer,timestamptz) from public,anon;
revoke execute on function public.get_public_chat_members() from public,anon;
grant execute on function public.get_public_chat_messages(integer,timestamptz) to authenticated,service_role;
grant execute on function public.get_public_chat_members() to authenticated,service_role;
