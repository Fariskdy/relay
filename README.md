# Relay

Relay is a polished client-side web app for a team cloud-transfer workspace. It helps a team review recent file transfers, understand who sent what, see expiry/status at a glance, and take quick action on links that need attention.

Built for the 3-day "Team Cloud Workspace" task with realistic mock data only. There is no backend, auth, database, or real upload flow.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Radix UI primitives
- lucide-react icons
- GSAP for the first-load splash animation

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## What Is Included

- Dashboard with recent transfers, workspace summary cards, status folders, and a transfer list.
- Transfer details panel with title, sender, files, recipients/activity, expiry, status, and actions.
- Search by transfer title, file name, sender, or recipient.
- Filters for team member and transfer status.
- Sort options for recent, expiring first, and largest first.
- Interactions for copy link, favorite, disable/enable, and extend expiry.
- Non-happy states for no transfers, no search results, loading, expired links, and disabled links.
- 10 realistic transfers, 5 team members, mixed file types, sizes, statuses, and expiry dates.
- Responsive mobile layout with bottom navigation and list-to-detail flow.
- Light/dark theme toggle with local persistence.
- Local persistence for favorites, disabled transfers, selected transfer, and theme.

## Product Decisions

Relay is intentionally designed as an operational dashboard instead of a marketing page. The layout favors scanning and repeated use: a fixed nav rail, status folders for quick triage, a focused transfer list, and a persistent details pane.

The status model is kept simple and visible. Active, expiring soon, expired, and disabled transfers are treated as first-class states because they map directly to what a team member needs to decide: download, extend, ignore, or re-enable.

The app uses mock data and simulated interactions to keep the scope aligned with the brief. The goal is to show product thinking, UX taste, and clean frontend implementation rather than backend breadth.

## Trade-Offs

- No backend, auth, uploads, database, or recipient-facing public link pages.
- Settings are present as a realistic shell, but profile/password changes are not connected to a service.
- The preview pane uses file-type icons and metadata rather than real document/image previews.
- Activity is simulated from mock data instead of event logs.
- State persistence uses `localStorage`, which is appropriate for this prototype but not a production data model.

## Project Structure

```text
app/           Next.js app routes, layout, and global styles
components/    Dashboard, navigation, list, preview, filters, and UI states
lib/           Mock data, types, status helpers, and formatting helpers
public/        Static assets used by the app
tasks/         Local planning and verification notes
```

## Verification

Completed checks:

- `npm run lint`
- `npm run build`
- Browser smoke test for first-load splash, dashboard render, navigation, transfer details, copy toast, disable/enable, no-results state, mobile details flow, and missing asset errors.

## AI Tools Used

I used Claude to help shape the project PRD, clarify the design direction, and refine the UI/UX path. I used Codex for AI-assisted coding, implementation, debugging, and verification.

Final behavior was checked with lint, production build, and browser smoke tests.
