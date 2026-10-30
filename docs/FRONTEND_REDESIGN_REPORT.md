# IISPP Frontend Redesign Report

**Date:** 2026-10-30
**Scope:** Public website redesign based on the written design specification. The referenced screenshot was not available to this session, so exact screenshot matching is not claimed.

## Summary

Updated the public-facing design system and homepage while keeping the existing React/Vite application, route tree, Laravel API clients, Firebase Authentication setup, and protected admin branch in place. The homepage now follows the requested content sequence and uses existing published API/configuration data. No Laravel files or dependencies were changed.

## Design system and shared layout

- Updated Tailwind brand tokens to the specified IISPP maroon, gold, background, and text colors; widened the shared page container and retained the existing Inter, Playfair Display, and Noto Sans Khmer font loading.
- Redesigned the public header with an institute/RUPP identity lockup, responsive search/language/menu controls, grouped accessible `<details>` navigation, and links only to existing destinations.
- Restyled the shared footer in maroon with identity, About, Academics, News & Events, contact, and settings-provided social/contact information.
- Simplified page headers, image fallbacks, and content card treatments to reduce gradients, hover movement, and heavy shadows.

## Homepage

The home page now renders in this order: Hero, About, Departments, Centers & Academic Support, Programs, Research Highlights, Latest News, Upcoming Events. The global footer follows the page.

- Hero uses the existing configurable hero image/title/subtitle and optional configured slides, existing campus/research photography, English introduction, Khmer institute name, and Academics/Research actions. Autoplay pauses on hover/focus, has accessible controls, and respects reduced-motion preference.
- About uses existing settings-backed image/text/mission/vision and displays Goals or Background only when the settings data provides them.
- Departments load from the existing published departments endpoint; up to four API records are shown with loading, empty, and error states.
- Center preview uses only names from `src/config/centers.js`. Because the configured records include campus service/support units and do not establish a separate set of IISPP research centers, the section is labelled “Centers & academic support”; no descriptions or official research-center claims were invented.
- Programs use existing published records and a horizontal level-based layout. No Academic Calendar destination was added because no route/data destination exists.
- Research highlights use the existing research service and display only returned records. News and events remain based on published API data and include metadata, links, and appropriate loading/error/empty handling.

## Inner pages and localization

- Applied shared styling to the About, Academic Programs, Departments, Centers, Research, News, Events, Contact, and relevant detail pages.
- Added/extended English and Khmer UI translations for navigation, common section labels, homepage actions, admissions, filters, contact feedback, event/research/news labels, and detail-page controls.
- Public content mapping now selects English or Khmer fields from API localized objects according to the persisted language, with English then Khmer fallback. Collection/document hooks refresh against locale-keyed cached results. Date formatting uses the selected locale.
- Content edits retain an existing Khmer translation when an English value is updated. New English-only admin content leaves the Khmer value blank rather than copying English as if it were translated.
- The existing Khmer dictionary was confirmed to contain Unicode Khmer; an earlier garbled terminal rendering was an output-encoding issue, so no blind source conversion was applied.

Localization is improved across the shared shell and the listed pages, but some legacy public copy and most admin UI strings remain English. A complete translation sweep still needs browser review.

## Files changed

- Shared visual system/layout: `src/index.css`, `src/components/layout/Navbar.jsx`, `src/components/layout/Footer.jsx`, `src/components/ui/CoverImage.jsx`, `src/components/ui/PageHeader.jsx`, `src/components/cards/Cards.jsx`.
- Homepage: `src/pages/public/Home.jsx`, `src/pages/public/home/Hero.jsx`, `AboutSection.jsx`, `ProgramsTabs.jsx`, `LatestNews.jsx`, `UpcomingEvents.jsx`.
- New homepage components: `src/pages/public/home/DepartmentsSection.jsx`, `CentersSection.jsx`, `ResearchHighlights.jsx`.
- Public pages: `About.jsx`, `Academics.jsx`, `Centers.jsx`, `Contact.jsx`, `Events.jsx`, `EventDetail.jsx`, `News.jsx`, `NewsDetail.jsx`, `ProgramDetail.jsx`, `Research.jsx`, `academics/Faculties.jsx`, `academics/FacultyDetail.jsx`, `admissions/Admissions.jsx`.
- Locale/data support: `src/utils/i18n.js`, `src/utils/constants.js`, `src/utils/format.js`, `src/services/contentService.js`, `src/services/settingsService.js`, `src/hooks/useCollection.js`, `src/hooks/useDocument.js`, `src/hooks/useSettings.jsx`.
- Audit: `FRONTEND_AUDIT.md`.

No existing components or routes were deleted. `StatsBand` and `VisitUs` are no longer mounted on the homepage; contact/location details remain available on the Contact page and through the footer. Existing files remain in the project.

## Preserved integrations and admin separation

- No changes to `src/services/api/apiService.js`, Firebase initialization/authentication, media upload endpoints, route guards, admin layouts, admin pages, backend files, or API endpoints.
- Existing content services remain the source for public department, program, research, news, event, settings, and contact data.
- Admin routes remain under the existing `/admin` route branch. The public navigation contains no admin/login/register entries.
- API/Firebase/admin flows were not exercised against a live backend during this work; preservation is based on keeping their existing endpoint/auth/route code intact and only updating locale presentation where noted.

## Responsive and accessibility review

- Added compact header controls, responsive menu sizing, responsive section grids, touch-friendly controls, semantic headings/landmarks, and keyboard-operable native dropdowns.
- Hero controls have accessible labels; hover/focus pauses autoplay; reduced-motion preference disables autoplay.
- No browser automation or screenshot tool was available in this session. The requested 1440px+, 1024–1366px, 768–1023px, and 375–767px viewport checks were **not performed**. No runtime claim of overflow-free behavior is made.

## Quality assurance

- `npm run build`: passed on 2026-10-30.
- Existing lint/test scripts: none are declared in `package.json`; no separate tests were run.
- Build warning: the main JavaScript bundle is about 542 kB minified (above Vite's 500 kB warning threshold). Existing campus and research PNG assets are large (about 2.3–4.1 MB emitted each); optimizing/converting those images is a remaining performance opportunity.
- `git diff --check`: no whitespace errors reported; Git emitted line-ending normalization warnings for edited files.

## Remaining content and visual dependencies

- Provide the actual reference image for pixel/layout comparison; current work follows the written brief.
- Confirm whether a verified IISPP research-center data source exists. Current `centers.js` lists centers/support units but does not provide descriptions or images.
- Leadership, Academic Calendar, Research Projects, and Publications do not have distinct existing routes/content models. They were not fabricated; add them only after destinations/data are confirmed.
- Confirm Goals/Background fields are available in saved settings if they should be editor-managed; the UI renders them only when present.
- Complete viewport/browser interaction checks and a remaining static-copy localization pass.

## Run the project

```bash
npm install
npm run dev
```

Configure the existing `.env` values and Laravel API URL as described in `README.md` before expecting live content, authentication, or uploads to work.
