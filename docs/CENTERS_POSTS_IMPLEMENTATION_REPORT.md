# IISPP Centers and Posts Implementation Report

## Phase 1 — Existing project inspection

**Branch:** `feature/iispp-website-redesign`  
**Inspection date:** 2026-10-30

### Findings

- Centers currently has a frontend-only list in `src/config/centers.js`. It contains eight campus centers and academic support units. `src/pages/public/Centers.jsx` renders those names as a list. No center images, descriptions, center detail routes, Laravel service, or Admin CMS resource were found.
- The request specifies three center names. They can be used as labels, but the repository has no official descriptions, images, staff, projects, publications, or contacts for them. New detail pages must therefore use an explicit empty state for unavailable details.
- Posts does not exist as a distinct content type. No Posts endpoint, service, public page, route, or CMS resource was found.
- News is an existing separate content type: `newsService` uses the Laravel `news` resource, `contentService.js` maps news title/summary/content/category/date, public pages exist at `/news` and `/news/:id`, and `RESOURCES.news` is available to the permission-protected Admin CMS at `/admin/news`. Categories are a field within News, not evidence of a Posts model.
- Research is already available at `/research` and uses `researchService`; it is separate from News.
- Existing Academics routes include `/academics`, `/academics/:id`, `/faculty`, and `/faculty/:id`. Department and program menu items are sourced from existing API services. No Academic Calendar route/data exists.
- The public shell is `PublicLayout`; Admin routes are separately nested under `/admin` and protected by `AdminRoute` and `AdminPermission`. The current Firebase-authenticated Laravel API flow and admin permissions can remain untouched.

### Reusable files and components

- Reuse `Navbar.jsx`, `Dropdown`/`MenuLink`/`MobileMenuGroup`, `useLang`, `useCollection`, `departmentService`, `programService`, `researchService`, `PageHeader`, `EmptyState`, existing `PublicLayout`, and the existing `/news`, `/events`, `/research`, `/admissions`, and `/contact` pages.
- Update `src/config/centers.js`, `src/pages/public/Centers.jsx`, `src/pages/public/home/CentersSection.jsx`, `src/components/layout/Navbar.jsx`, `src/routes/AppRoutes.jsx`, and `src/utils/i18n.js` to support the requested centers and navigation.
- Add one public center detail page component for the three specified slugs. No Posts frontend routes, API client, CMS resource, or backend schema will be fabricated.

### Posts limitation and smallest follow-up

The safe frontend-only approach is to expose Posts as unavailable in navigation without linking it to News or creating fake routes. To implement All Posts, Latest Posts, Categories, post details, and Admin management, the project needs an approved Posts content model, Laravel public/admin endpoints and response contract, category semantics, permissions, and official content. Backend approval/work is required before those screens can be functional.

## Implementation results

### Files changed for the supported work

- Updated `src/config/centers.js` with exactly the three names requested and stable detail slugs. It contains no descriptions, images, contact fields, or invented center data.
- Updated `src/pages/public/Centers.jsx` to list those three centers and link to details.
- Added `src/pages/public/CenterDetail.jsx` and `/centers/:slug` in `src/routes/AppRoutes.jsx`. Known slugs show the official supplied name and an empty state for unavailable details; unknown slugs show a not-found empty state.
- Updated `src/pages/public/home/CentersSection.jsx` to display and link to all three configured centers.
- Updated `src/components/layout/Navbar.jsx` with the requested order for the supported sections: Home, About IISPP, Academics, Research, Centers, Posts, News & Events, Students, Contact. Centers links to each detail route. Posts opens an explicit unavailable notice rather than fake links. Students uses the existing `/admissions` destination. Academics continues to use actual department/program API data and retains the calendar-unavailable notice.
- Updated `src/pages/public/News.jsx` so the existing Announcement category can be reached through `/news?category=Announcement`; other News routes and content remain in place.
- Added English and Khmer labels/status copy in `src/utils/i18n.js`.

### API, CMS, and route status

- Reused existing department/program services and existing Research, News, Events, and Admissions routes. News/Events links do not create new content endpoints.
- No Centers API or CMS exists in the inspected frontend. The three supplied center names are frontend configuration only; details remain empty until official content/API support is available.
- No Posts API, model, public route, or Admin CMS resource exists. Posts remains non-functional and is clearly marked unavailable. No Posts routes, API calls, categories, or CMS screens were created.
- No Admin, Firebase, Laravel API, auth, permission, media-upload, or backend files were changed. Admin routes remain separate under `/admin`.
- Firebase Hosting already rewrites paths to `/index.html`; this supports direct SPA route entry for `/centers/:slug`. The rewrite configuration was not changed.

### Accessibility and responsive behavior

- Reused the existing desktop dropdown and mobile accordion patterns. Menu links close the mobile menu after navigation; keyboard focus styling is provided by the existing global `:focus-visible` rule. Dropdowns support click, hover, ArrowDown, Escape, and focus exit handling.
- No browser/device interaction audit was run in this environment, so actual hover, keyboard, viewport, and refresh behavior still needs runtime confirmation.

### Validation

- `npm run build` — **passed** (Vite 8.3.4; 2044 modules transformed).
- Vite emitted its existing warning that the minified JavaScript chunk exceeds 500 kB. No code splitting was introduced as part of this scoped change.
- `git diff --check` — passed with line-ending conversion warnings only.
- No automated test or browser test command is defined in `package.json`; no such tests were run.

### Remaining requirements

- Posts functionality requires an approved Posts model and distinct Laravel public/admin endpoints and response contract, category behavior, permissions, and official content. Until those exist, the menu notice is the only safe frontend representation.
- Center details require approved descriptions, images, and/or contacts and an agreed data source or Admin workflow. The detail routes intentionally show empty states in their absence.
- Confirm that the three supplied center names should replace the eight previously configured campus center/support labels. They are used exactly as requested; no further names are included.
