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
- `https://joinaftr.app/join/INVITE_CODE`

The join page opens AFTR using `aftr://join/INVITE_CODE` for people who already
have the app. Its store button is intentionally a non-link placeholder until
the App Store and Google Play listings are live. Replace that placeholder in
`join/index.html` with the store URLs when they are available.

## Android APK sharing before Google Play is available

The Android join path is `https://joinaftr.app/join/INVITE_CODE` →
`/get-aftr?code=INVITE_CODE`. It copies the invite code when possible and sends
Android users to the APK page if AFTR is not already installed. AFTR already
reads that code from the clipboard on launch; the page also keeps it in the URL
and visible on screen as a fallback.

Before sharing Android invite links, upload the signed release APK to a stable,
public HTTPS URL. Then set `ANDROID_APK_URL` in `get-aftr/index.html` to that
exact URL (or provide it as `window.AFTR_ANDROID_APK_URL` before the page
script executes). Leaving it blank deliberately shows an actionable “link not
ready” state instead of pretending the download works.

Tester steps: open the QR link in Chrome, tap **Join the Dump**, then tap
**Download AFTR (Android)**. Android may ask to allow installs from that source
and may show Play Protect guidance. After installation, open AFTR; if it did
not launch automatically, use **I already have AFTR** or open the app manually.
The invite code remains visible and can be copied again.

Use the temporary Vercel URL only for testing. Use the custom domain in App Store Connect and Google Play Console.
