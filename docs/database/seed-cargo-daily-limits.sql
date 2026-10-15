-- Restore missing configuration using the table's existing default (5/day).
-- Preserve any limits already configured by the administrator.
insert into public.cargo_daily_post_limits(business_user_type) values ('CARGO_OWNER'),('BROKER'),('TRANSPORT_COMPANY') on conflict(business_user_type) do nothing returning business_user_type,daily_limit;
