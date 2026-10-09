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

## Test checklist

Dress rehearsal on desktop Chrome (T10) passed: full day in preview mode, no locked-title leaks at any simulated time, +15 perc and Következő megnyitása behave, offline reload of the install gate, fonts render ő/ű. Items marked iPhone need Dávid's own installed app.

- [x] Full simulated run of the day in preview mode, every stage opened and completed (Chrome)
- [x] Locked cards show no stage titles or place names at any simulated time (Chrome)
- [x] +15 perc moves the countdowns and the hint times together (Chrome)
- [x] Következő megnyitása opens exactly one stage (Chrome)
- [x] ő, ű, Ő and Ű render correctly in all three fonts (Chrome)
- [ ] iPhone: airplane mode, every stage loads and photos still save
- [ ] iPhone: force-quit and reopen, answers, stamps and photos are still there
- [ ] iPhone: the camera opens from the installed app and the photo appears as a polaroid
- [ ] iPhone: the collage reaches Photos through the share sheet
- [ ] iPhone: opening the URL in Safari shows only the install instructions

## On her phone, after installing

- [ ] Preview mode is off ("Valós idő"), the shift is 0, and no test data exists ("Minden törlése" on Dávid's own phone only; on hers install fresh)
- [ ] The prep quiz is the only open stage when she first sees the app
- [ ] Replace placeholders before the final deploy: `TODO: Dávid` messages, finale letter, admin PIN `0000`
