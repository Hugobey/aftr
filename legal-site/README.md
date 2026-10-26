# AFTR legal site

This dependency-free static site is intended to be deployed as a separate Vercel project.

## Before deploying

Replace every occurrence of `REPLACE-WITH-YOUR-SUPPORT-EMAIL` in `privacy.html` and `terms.html` with a monitored support email address. Review these drafts with qualified legal counsel before publishing them as your final policies.

## Deploy to Vercel

1. Create a new Vercel project from this repository.
2. Set the project's Root Directory to `legal-site`.
3. Deploy. Vercel will provide a temporary `*.vercel.app` URL.
4. Add `joinaftr.app` under the project’s Domains settings and follow Vercel’s DNS instructions.

The published URLs will be:

- `https://joinaftr.app/privacy`
- `https://joinaftr.app/terms`

Use the temporary Vercel URL only for testing. Use the custom domain in App Store Connect and Google Play Console.
