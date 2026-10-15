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

## Follow-up: transport integrity and admin scope tests

- Reproduced and fixed direct soft deletion of cargo after a transport request was accepted. The existing database update trigger now rejects that operation; legitimate cancellation RPCs remain unchanged. A CLI-generated, idempotent migration records the applied fix.
- Verified ordinary owners can still soft-delete unassigned cargo.
- Added rollback-only tests for CHAT/CARGO scope separation, blocked self-promotion, private profile access and super-admin map access.
- Added web shipment stage controls and history based on server-provided capabilities. Tests cover the full SELECTED → COMPLETED lifecycle, owner/provider responsibilities, stale-status rejection and history isolation.
- Added GitHub Actions checks for regressions, SEO, asset hashes and release rebuild consistency. These checks do not by themselves gate Vercel's automatic deployment.
- No synthetic accounts or test shipments are retained.

## Follow-up: notifications and read reliability

- Unread badges now use the authenticated server's total count, independent of the 40 displayed notifications.
- Deduplicate simultaneous notification reads; force a fresh read after mark-read operations, and ignore older or cross-account responses.
- Clear private views immediately on account transitions; reject late profile and business-profile responses.
- Show notification refresh errors and a retry control instead of silently retaining stale data.
- Bound cargo and notification reads to 15 seconds with query cancellation. Writes are not automatically retried.
- Notification cargo navigation waits for the feed and explains when the target cargo is unavailable.
- Added automated regression coverage for these cases to the quality workflow.

### Route metadata consistency follow-up
- Editing a cargo city or country as free text now explicitly clears the old city ID, geoname ID, coordinates and translated city names. Previously those fields could still describe the previous route and affect distance sorting and nearby notifications.
- Selecting a city replaces the entire metadata set, including clearing optional fields absent from the new result. Unchanged routes preserve existing location data.
- Added regression checks for city/country changes, unchanged routes, incomplete city results and invalid numeric coordinates; included in CI. No bulk changes to existing cargo records were made.
