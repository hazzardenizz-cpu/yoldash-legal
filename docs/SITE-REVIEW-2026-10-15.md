# Site review — 15 October 2026

Reviewed production source `yoldash-legal`, in the order structure, UX, security, features.

## Changes

- Serialize feed reads; paginate beyond 50 loads and refresh every loaded page.
- Preserve the last successful feed on network errors and explain stale data.
- Fall back safely when browser storage is unavailable; unknown pages show home.
- Normalize Persian/Arabic search characters and support multiple search terms.
- Add keyboard focus, 44px controls, reduced motion and translated chat controls.
- Apply 10-second upstream timeouts, validate response shapes and restrict public handlers to GET/HEAD.
- Stop describing closed/full loads as active on shared public pages.
- Revoke anonymous execution of public-chat messages/member RPCs to match the website's sign-in requirement. Authenticated and service-role access remains granted.
- Show translated transport states and open accepted-offer chats directly.

## Validation

`test-site-structure.mjs`, `test-transport-flow.mjs`, `test-public-seo.mjs`, `check-seo.py`, JavaScript syntax and build checks.

Database: row-level security enabled across public tables; user-role policies allow reads only; profile updates restricted by column grants; anonymous chat permission revoked and authenticated permission verified.

## Remaining limits

This is a scoped review, not a complete penetration test. Device background push and two real signed-in mobile-browser accounts still need device testing. Database advisors retain warnings for intentionally exposed SECURITY DEFINER APIs, which require function-by-function authorization review. Tables with RLS and no policies remain denied to ordinary clients; do not add blanket policies to silence these notices.

Leaked-password protection remains disabled; no supported configuration tool was available to enable it in this session. Follow https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection .
