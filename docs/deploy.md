# Deploy

## Cloudflare Pages

1. Push the private GitHub repo.
2. Cloudflare dashboard, Workers & Pages, Create, Pages, connect the repo.
3. Build command: `npm run build`. Output directory: `dist`. Node 20+.
4. Every push to `main` redeploys. Keep the Pages URL to yourself (no previews shared, `noindex` is set).

## Install on iPhone

1. Open the Pages URL in Safari.
2. Share icon, then "Főképernyőhöz adás".
3. Open the app from the Home Screen icon. Safari and the installed app keep separate storage, so never start progress in a Safari tab.
4. Open it once online, then once more: the service worker precaches everything, so it then works in airplane mode.

## Important

Ship the final build BEFORE installing on her phone. With `autoUpdate`, a new deploy reaches the phone only when the app is opened online and applies on the following launch.
