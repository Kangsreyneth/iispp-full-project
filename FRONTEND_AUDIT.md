# IISPP Frontend Project Audit

**Audit scope:** Phase 1 was completed before implementation. Source changes made after the subsequent implementation authorization are summarized at the end of this report.

## Reference and comparison basis

The pasted design brief gives written requirements, but no separate design reference image was present in the page context or workspace. Findings below compare the current implementation with that brief; exact visual matching (composition, photography, crop, spacing and typography) remains pending receipt of the reference image.

The requested palette is primary maroon `#680D2D`, dark maroon `#4A0A20`, gold `#C69A3A`, light gold `#E7C77E`, white `#FFFFFF`, background `#F8F8F6`, text `#263248`, muted text `#718096`. Existing CSS uses a different maroon/gold/slate set.

## 1. Current project architecture

- React 19 JSX application built with Vite 8; Tailwind CSS 4 is integrated through the Vite plugin.
- `src/main.jsx` mounts `App` under StrictMode. `src/App.jsx` composes BrowserRouter, language/settings/auth providers, routes, and toast notifications.
- React Router 7 splits the public site and staff/admin portal into separate route/layout branches.
- Browser data requests use a Laravel REST API. Firebase client SDK use is limited to Firebase App/Auth and ID tokens; Firestore/Storage are not initialized in the frontend.
- Admin CRUD screens are configured through resource metadata and shared form/table components.
- Firebase Hosting serves `dist` and rewrites paths to `index.html` for SPA routes.

## 2. Existing folder and file structure

```text
public/                         favicon
src/
  assets/images/                campus, IISPP, student, library, research images
  assets/logos/                 IISPP, RUPP, institute seal
  components/cards/             News, event, program, faculty cards
  components/forms/             TextField, DynamicForm
  components/layout/            Navbar, Footer, SearchDialog, AuthLayout, ConfigBanner
  components/tables/            DataTable
  components/ui/                Buttons, dialogs, headers, image/map helpers, etc.
  config/                       Admin resources and research center config
  hooks/                        Auth, language, settings, collection/document/search
  layouts/                      PublicLayout, DashboardLayout, AdminLayout
  pages/admin/                  Dashboard, content CRUD, messages, users, settings
  pages/auth/                   Login, signup, password reset, profile
  pages/public/                 Public pages, home sections, academics, admissions
  routes/                       Route tree, guards, scroll handling
  services/                     Firebase setup, Laravel API, domain service modules
  utils/                        Constants, formatting, i18n, search, validation, seed
  App.jsx, index.css, main.jsx
firebase.json, firestore.rules, storage.rules, vite.config.js, package.json
```

## 3. Current pages and routing

Public routes share `PublicLayout`: `/`, `/about`, `/program`, `/academics`, `/academics/:id`, `/department`, `/faculty`, `/faculty/:id`, `/admissions`, `/research`, `/centers`, `/news`, `/news/:id`, `/events`, `/events/:id`, `/contact`, `/search`, and a not-found route. `/program` and `/academics`, plus `/department` and `/faculty`, are aliases.

Admin/auth routes include `/admin` login, `/admin/forgot-password`, guarded `/admin/dashboard`, `/admin/pages`, `/admin/news`, `/admin/events`, `/admin/programs`, `/admin/faculties`, `/admin/messages`, `/admin/users`, `/admin/settings`, and `/profile`. Signup page code exists at `src/pages/auth/Signup.jsx` but is not registered in `AppRoutes.jsx`; README instructions mentioning `/signup` do not match the route table.

## 4. Existing reusable components

- Site shell: `Navbar`, `Footer`, `SearchDialog`, `ConfigBanner`, `PublicLayout`, `AdminLayout`, `DashboardLayout`, `AuthLayout`.
- Public UI: `PageHeader`, `SectionTitle`, `CoverImage`, `MapEmbed`, `ShareBar`, `EmptyState`, `Spinner`, `Badge`, `NotFoundBlock`.
- Actions/overlays: `Button`, `Modal`, `ConfirmDialog`.
- Content cards: `NewsCard`, `EventCard`, `ProgramCard`, `FacultyCard` (`components/cards/Cards.jsx`).
- Admin: `DynamicForm`, `TextField`, `DataTable`, `ImageUpload`; collection fields/columns are in `config/resources.js`.

## 5. Styling system and design issues

`src/index.css` defines brand/font tokens, global focus behavior, container sizing, prose styling, fade-up animation, and reduced-motion handling. Most page styles are Tailwind utility classes. Current style uses maroon/gold accents, slate surfaces, rounded cards and soft shadows; compare against the brief's exact tokens and restrained academic aesthetic.

Concrete issues observed:

- Initial terminal output displayed Khmer and punctuation as mojibake. A direct UTF-8/codepoint check confirmed the existing Khmer dictionary uses valid Khmer Unicode; source-wide blind conversion would damage it. Browser rendering still needs visual verification.
- The language toggle does not translate the full UI: page descriptions, validation/status messages, section labels, and other static copy remain English.
- `contentService.js` often flattens bilingual objects to one string using English-first fallback, so selected-language content is not consistently rendered.
- Home hero auto-advances every five seconds; pause state and pause-on-hover/focus handlers are unused/commented, and arrow controls are absent/commented.
- `ProgramsTabs` renders three panels side-by-side and changes active styling on hover/click; review true tab semantics and narrow-screen behavior.
- Global route fade animation and rounded/shadow-heavy surfaces should be compared with the brief's instruction to avoid unnecessary animation/shadows.
- Font-family names include Noto Khmer and display fonts, but no local font assets or explicit font-loading configuration were found; verify actual loaded fonts.
- The config banner is included in the public shell; check visibility against the intended design.

## 6. Firebase and API integration

`services/firebase.js` initializes Firebase App/Auth using Vite environment variables and browser-local auth persistence. `services/api/apiService.js` builds the Laravel API URL and adds Firebase ID tokens to authenticated requests. `contentService.js` centralizes public list/detail and admin CRUD mapping; domain service modules wrap it. Settings and contact message services use public/admin endpoints. `storageService.js` uploads media through Laravel multipart endpoint, with a client-side 5 MB limit and progress reporting. `useAuth` reads profile/permissions from Laravel; `AdminRoute` and `AdminPermission` guard admin pages.

README and Firebase rules describe Laravel as the application-data gateway, with direct browser Firestore/Storage access denied. Backend code is outside this workspace and was not audited. `useCollection` caches collection requests in a module Map; consider refetch/invalidation expectations after changes.

## 7. English/Khmer implementation

`useLang.jsx` defaults to English, stores selection in `localStorage`, updates `<html lang>`, and exposes `t()`. `utils/i18n.js` holds UI dictionaries; some labels are translated through `t()`. Content mapping is not uniformly locale-aware, and generic admin fields do not appear to provide complete bilingual editing. New content can be copied to both language fields by service mapping. Fix encoding and establish consistent locale-aware selection without incorrectly translating official department names.

## 8. Responsive design findings

Responsive Tailwind breakpoints are present, but no browser/device viewport audit has been performed. Verify the requested 1440px+, 1024–1366px, 768–1023px, and 375–767px widths. Areas to inspect include: mobile nav height/scroll; large hero min-heights and Khmer copy wrapping; three-column program panels from `md`; statistics row from `sm`; fixed news thumbnails and event date blocks; touch targets and keyboard behavior on dropdowns, filters, carousel dots, and hover-driven panels. These are verification targets, not confirmed runtime defects.

## 9. Sections compared with written design brief

- **Header/nav:** Logo, institute/parent name, search dialog, language toggle, responsive menu exist. Search is icon-triggered rather than an always-visible field. Current navigation is flat plus a department/center dropdown; brief's grouped About/Academics/Research/News & Events/Students structure is missing.
- **Hero:** Existing configurable carousel, academic CTA, contact CTA, and quick links. Brief's specific title/introduction/Khmer subtitle and Discover Research CTA are absent; slider accessibility needs work.
- **About:** Editorial split image/text exists on home; mission and vision are conditional. Goals are absent.
- **Departments:** API-backed department/faculty list and details exist. Verify the four named departments and their real imagery/content against the data; do not invent records.
- **Research centers:** `config/centers.js` feeds a centers page and navbar; no rich home center section. Verify official names/content.
- **Programs:** Home presents Undergraduate, Graduate, and Short-course panels. No academic calendar feature/route is apparent, and current layout differs from requested horizontal feature layout.
- **News/research:** Home has latest news and events; research has its own listing but not a home highlight. Reuse published API content; no fake official news.
- **Footer:** Logo, links, settings-based social/contact, and copyright exist. Surface is slate/white rather than specified maroon footer; verify official contact settings.
- **Inner pages:** About, departments, programs, research, centers, news/events, contact exist. Distinct Leadership, Academic Calendar, Research Projects, and Publications pages are not apparent; decide based on actual content model/reference and avoid duplicate equivalents.
- **Admin separation:** Public/admin routes are separate; preserve this and do not add admin login/register links to public navigation.

## 10. Recommended files/components

Likely files: `src/index.css`; `src/components/layout/Navbar.jsx`, `Footer.jsx`, `SearchDialog.jsx`; `src/layouts/PublicLayout.jsx`; `src/pages/public/Home.jsx` and `home/*`; existing public pages under `src/pages/public`; `src/components/cards/Cards.jsx` and `components/ui/*`; `src/utils/i18n.js`, `src/hooks/useLang.jsx`, `src/services/contentService.js`; `src/routes/AppRoutes.jsx` only for confirmed route needs; `src/config/centers.js` and `config/resources.js` only if verified data or fields require changes.

Possible additions, subject to reference: grouped/mega navigation, department feature section/card, academic calendar feature, research highlight, horizontal program feature, locale-aware content selector. Reuse existing page/card/header primitives first. Do not invent official center/department/news data or add duplicate pages.

## Proposed implementation plan

1. After approval, map exact visual requirements from the image when available. If no image is accessible, follow the written design brief and do not claim image-accurate matching.
2. Confirm content, imagery, verified department/center records, language behavior, and mobile expectations.
3. Establish shared design tokens, typography, spacing, buttons, navigation, containers, and reusable primitives.
4. Redesign homepage in the brief's requested order, reusing existing API/Firebase data and preserving public/admin and auth/API boundaries.
5. Align existing inner pages and add only confirmed missing routes/sections; implement complete bilingual behavior.
6. Review desktop, laptop, tablet, mobile, keyboard interaction, Khmer rendering, image loading, and route/API behavior. Run existing quality commands and report backend/content dependencies.

# Step-by-step to-do checklist

The following checklist was the proposed plan. The later implementation authorization allowed work to proceed from the written brief when the reference image was unavailable; actual completion and test status are recorded in the implementation report below.

## Phase 1 — Audit and scope

- [x] Inspect project structure, dependencies, architecture, routes, components, styling, integrations, language, and assets.
- [x] Compare implementation with the written design brief and document gaps/files/components.
- [ ] Provide/confirm the actual visual reference for exact visual matching.
- [ ] Approve implementation scope.

## Phase 2 — Design system

- [ ] Confirm design tokens against the reference and update `src/index.css`.
- [ ] Verify English/Khmer font loading and browser rendering; repair only confirmed rendering defects.
- [ ] Standardize spacing, heading hierarchy, buttons, containers, focus behavior, image crop, and restrained motion.
- [ ] Extend existing shared UI components where useful; avoid duplicates.

## Phase 3 — Header and homepage

- [ ] Build the approved navigation hierarchy, dropdowns, active states, search, and mobile behavior; keep admin links out of public nav.
- [ ] Localize public navigation and verify keyboard/touch operation.
- [ ] Update hero with approved copy/images, Academics and Research actions, and accessible slider controls if needed.
- [ ] Refine split About section; show Goals only with approved content.
- [ ] Present the four departments from verified records with images, descriptions, details, and view-all link.
- [ ] Present verified research centers; do not invent official information.
- [ ] Rework program levels into the approved layout; add calendar link/feature only with confirmed destination/content.
- [ ] Add news and research highlights using existing published API data only.
- [ ] Restyle footer and verify contact/social data sources.

## Phase 4 — Inner pages and routing

- [ ] Apply shared layout, title/breadcrumb, spacing, and typography to existing public pages.
- [ ] Review About, departments, programs, research, centers, news/events, and contact against the reference.
- [ ] Decide whether Leadership, Academic Calendar, Research Projects, and Publications need new pages or fit existing routes/data; create only confirmed needs.
- [ ] Preserve existing public routes and separate admin routes/permissions.
- [ ] Reconcile `/signup` only if it is intended to be reachable; keep admin authentication separate from public navigation.

## Phase 5 — Bilingual behavior

- [ ] Keep English as default and preserve language choice with existing localStorage pattern.
- [ ] Translate navigation, buttons, headings, form labels, empty/loading/error states, and static content.
- [ ] Render API bilingual content according to locale without flattening it too early.
- [ ] Preserve official names and verify Khmer typography, wrapping, and mixed-language copy.

## Phase 6 — Responsive and accessibility review

- [ ] Check desktop at 1440px and above.
- [ ] Check laptop at 1024–1366px.
- [ ] Check tablet at 768–1023px.
- [ ] Check mobile at 375–767px.
- [ ] Fix overflow, clipping, image sizing, touch targets, and grid behavior.
- [ ] Verify semantic structure, keyboard navigation, visible focus, image alternatives, reduced motion, and carousel controls.

## Phase 7 — Quality assurance and handoff

- [ ] Run `npm run build` and existing lint/test commands; package scripts currently declare no lint/test commands.
- [ ] Inspect browser console/network issues if browser review is available.
- [ ] Confirm public API data, contact submission, Firebase authentication, and admin routes remain functional.
- [ ] Report changed files/components/routes, viewport checks, build/test results, remaining dependencies, and run instructions.

**Phase 1 complete:** audit/checklist documented before implementation authorization.

## Visual-reference review status and file/component plan

**Image access status (2026-10-30):** The user indicated that the homepage reference image was provided, but no reference image file is available in the current message context, the Codex attachment file list, or the frontend workspace. The only images found in the workspace are current project assets (logos and content photography), not a clearly identified design screenshot. Therefore, this audit cannot claim image-specific observations such as exact section heights, alignments, typography sizes, image crops, or spacing. The concrete comparisons below are based on the written design brief; exact image comparison remains an open Phase 1 input.

### 1–3. Components to redesign, reuse, and files likely to change

| Area | Existing component/file | Recommendation | Reason from written brief/current code |
|---|---|---|---|
| Public shell/navigation | `src/components/layout/Navbar.jsx` | Redesign | Existing flat nav and department/center dropdown do not represent requested grouped sitemap; search is icon/dialog rather than specified search field. Preserve existing route destinations and mobile menu behavior. |
| Public shell/layout | `src/layouts/PublicLayout.jsx` | Reuse and adjust only if needed | Already places shared notice, navbar, page content, and footer. Keep the shared shell for all existing public pages. |
| Search | `src/components/layout/SearchDialog.jsx` | Reuse, possibly adapt presentation | Search behavior already exists; retain it if the image's search field can open/use this existing search experience. |
| Footer | `src/components/layout/Footer.jsx` | Redesign | Required content areas mostly exist; visual surface is currently light/slate rather than the brief's maroon footer. Preserve settings-driven social/contact data and existing destinations. |
| Homepage composition | `src/pages/public/Home.jsx` | Redesign composition/reuse children | It currently composes Hero, Stats, About, Programs, News, Events, VisitUs. Reorder/replace only after visual reference comparison; retain data-fetch hooks. |
| Hero | `src/pages/public/home/Hero.jsx` | Redesign | Existing carousel and actions can be adapted; current default copy is generic, has Contact instead of dedicated Research CTA, and lacks active pause/arrow controls. Keep settings and existing image assets/API values. |
| About block | `src/pages/public/home/AboutSection.jsx` | Reuse and extend | Split editorial layout exists; add Goals only if verified content is available. Preserve settings-backed fields and image handling. |
| Departments feature | Existing `src/pages/public/academics/Faculties.jsx`, `src/components/cards/Cards.jsx` | Reuse cards/data and redesign presentation; a home section may be needed | Department list/detail data paths already exist. Verify the four official records and images; do not hardcode replacements. |
| Research centers | `src/config/centers.js`, `src/pages/public/Centers.jsx` | Reuse data and existing page; create a home section component if reference requires it | Center names already come from project configuration. Verify source before presenting as official. |
| Programs | `src/pages/public/home/ProgramsTabs.jsx` | Redesign presentation; reuse service/data | Programs are API-backed and separated by level. Written brief asks for horizontal feature presentation and calendar entry; current component is a three-column panel. |
| News highlight | `src/pages/public/home/LatestNews.jsx` | Reuse and adapt | Uses published news data and existing card/image primitives. Retain real API data and avoid mock content. |
| Research highlight | `src/pages/public/Research.jsx`, `src/services/researchService.js` | Reuse data mapping; add home presentation only if reference confirms | Research listing already exists; no homepage research highlight currently. |
| Shared styles | `src/index.css` | Redesign tokens/global values | Existing palette does not match written palette; use exact image to confirm actual color values and typography before committing. |
| Shared cards/headers | `src/components/cards/Cards.jsx`, `src/components/ui/PageHeader.jsx`, `SectionTitle.jsx`, `CoverImage.jsx`, `Button.jsx` | Reuse, style to design system | Existing reusable primitives reduce duplication; adjust variants rather than replace without need. |
| Localization | `src/utils/i18n.js`, `src/hooks/useLang.jsx`, `src/services/contentService.js` | Fix/extend | Existing language persistence should remain; repair corrupted strings and preserve locale-aware values through rendering. |
| Routes | `src/routes/AppRoutes.jsx` | Change only for confirmed missing destinations | Preserve current routes and admin branch. Add no duplicate routes for existing page equivalents. |

Likely homepage-specific new components, only if the accessible reference calls for separate reusable sections: `DepartmentsSection`, `ResearchCentersSection`, `ResearchHighlights`, and/or an academic calendar feature. Existing section, card, image, and button components should be reused where possible.

### 4. Layout reproduction approach

Once the image is available, record a section-by-section reference map before coding: (a) utility/header rows and logo lockup; (b) navigation groups and dropdown behavior; (c) hero height, text alignment, overlay, copy hierarchy, CTA placement, and image focal point; (d) each homepage section's background, content width, column proportions, vertical spacing, and card treatment; and (e) footer columns and color block. Then implement in this order:

1. Match global container width, palette, fonts, heading scale, spacing rhythm, and image treatment in shared tokens/primitives.
2. Match the shell (header, navigation, footer) so all public pages share the reference's framing.
3. Recompose `Home.jsx` in the reference's exact section order, using existing data hooks and content components.
4. Match each section's grid/stack behavior at the specified viewport widths; use measured proportions from the reference instead of guessing.
5. Compare browser screenshots at desktop, laptop, tablet, and mobile widths with the reference, iterating on crop, spacing, typography, and breakpoint behavior.

Until the image is accessible, the specific pixel/layout measurements and any image-specific deviations must remain unasserted. The written brief's order remains: header/navigation, hero, About, departments, research centers, programs/calendar, news/research highlights, footer.

### 5. Preserving Laravel, Firebase, and admin behavior

- Keep `src/services/api/apiService.js`, content domain services, settings service, and message service contracts intact while changing presentation. Continue reading public content through existing API methods.
- Keep Firebase initialization/auth state in `src/services/firebase.js`, `src/services/authService.js`, and `src/hooks/useAuth.jsx`. Do not introduce direct Firestore/Storage client access; image uploads remain routed through Laravel `storageService.js`.
- Keep admin routes under their existing `/admin` branch and preserve `AdminRoute`, `AdminPermission`, `AdminLayout`, and each resource service/permission mapping. Public navbar redesign must not add Admin Login/Register links.
- Treat changes to content mapping or locale selection as narrowly scoped data-presentation work and preserve the existing request/response shape. Confirm API data contracts before changing any service behavior.
- Do not alter backend files as part of the frontend redesign. Use only verified records/settings for departments, centers, news, and contact details.

**Audit gate at the time of writing:** The component/file plan was based on the written brief and inspected source. Exact visual comparison was pending the image. The subsequent implementation prompt authorized work using the written brief if the image was unavailable.

## Implementation follow-up

The later master prompt authorized implementation after the safety check, with the written specification as the fallback when no design image is accessible. The current branch had no tracked source changes at the pre-redesign backup commit `0cb41c1`; the only pre-existing untracked workspace item was this audit file created during Phase 1.

The public UI redesign, shared academic styling, homepage sections, selected inner-page updates, and locale-aware content selection have since been implemented. Build outcome, changed-file inventory, remaining dependencies, and verification limits are documented in [docs/FRONTEND_REDESIGN_REPORT.md](docs/FRONTEND_REDESIGN_REPORT.md).

**Current status:** Production build passes. Exact image matching and browser viewport testing remain unverified because the reference image and browser tooling were not available. API, Firebase, and admin functionality were preserved in code but not live-tested against the backend.
