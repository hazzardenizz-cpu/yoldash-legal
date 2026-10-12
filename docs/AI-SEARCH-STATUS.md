# Yoldash AI search visibility — 2026-10-12

## Published work
- Public, server-rendered factual summaries on Persian, Turkish and English About pages: identity, official domain, audience, practical use cases and operational scope.
- Consistent Organization identity and official social links on About pages.
- Three translated content-policy pages explain sources, examples, assisted drafting and revision dates; they do not invent professional credentials.
- Updated llms.txt to match current public workflows and canonical URLs. Removed unsupported claims about trip expenses and counter-offers.
- Explicit public crawler rules for OAI-SearchBot, Claude-SearchBot, Claude-User and PerplexityBot. Existing training-crawler settings were preserved. No firewall or authentication protections were weakened.
- New policy pages linked from About pages and included in the sitemap.

## Why this approach
- OpenAI distinguishes search crawling from model training. Allowing GPTBot is not a requirement for search visibility.
  Source: https://developers.openai.com/api/docs/bots
- Google says generative search still relies on SEO, useful accessible content and indexing. It does not use llms.txt as a special signal.
  Source: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- Anthropic documents separate crawler purposes and robots.txt controls.
  Source: https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler

## Measurement limits
A successful public HTTP request using a crawler user-agent is not proof that a genuine crawler visited or that a model recommended Yoldash. Actual crawling needs server logs; actual mentions need repeated query/citation measurements and referral analytics. Search Console and GSC Wizard measurement access remains blocked by the subscription limitation recorded in SEO-STATUS.md.

## Baseline query set for future measurements
Record engine, date, language, geography, exact query and cited domains. Count a brand mention separately from a linked citation; a one-off answer is not a stable ranking.
- Persian: «پلتفرم اعلام بار ایران و ترکیه»; «چطور برای بار برگشت کامیون بار پیدا کنم؟»
- Turkish: “Türkiye İran yük ilanı platformu”; “İran Türkiye transit sürücü nasıl bulunur?”
- English: “Türkiye Iran road freight load board”; “how to compare road freight quotations”

Recommendation, indexing and training inclusion are separate outcomes. None is guaranteed by these changes.
