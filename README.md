# IISPP Website + Admin Dashboard (React + Laravel API)

Public website for the **Institute for International Studies and Public Policy (IISPP), Royal University of Phnom Penh**.
Visitors browse freely (no login). Approved **staff** sign in to a dashboard to manage news, events, programs and faculties.

Stack: React 19 (JSX) · Vite · Tailwind CSS 4 · React Router · Laravel API · Firebase Authentication, Firestore, Storage, Hosting.

Firebase Authentication handles sign-in. The Laravel API is the only application data gateway and uses server-side Firebase credentials for Firestore and Storage. Browser Firestore and Storage rules deny direct access.

---

## 1. Create the Firebase project (once)
1. https://console.firebase.google.com → **Add project**
2. **Build → Authentication → Get started →** enable **Email/Password**
3. **Build → Firestore Database → Create database** (production mode)
4. **Build → Storage → Get started**
5. **Project settings → Your apps → Web (`</>`)** → register app → copy the config
6. Copy `.env.example` to `.env`, add the Firebase web config, and set `VITE_API_BASE_URL` to the Laravel server origin (for example `http://localhost:8000`). The frontend adds `/api/v1` automatically.
7. Put your project id in `.firebaserc`

## 2. Configure and run the Laravel API

Configure `institute_iispp/.env` with `FIREBASE_PROJECT_ID`, `FIREBASE_WEB_API_KEY`, `FIREBASE_CREDENTIALS`, `FIREBASE_STORAGE_ENABLED=true`, `FIREBASE_STORAGE_BUCKET`, and the frontend origin in `CORS_ALLOWED_ORIGINS`. The service-account JSON must belong to the same Firebase project and stay outside public web directories and version control. `FIREBASE_STORAGE_BUCKET` is the bucket name shown in Firebase Console → Storage (for example `your-project.firebasestorage.app`). Install the Laravel dependencies and start the API from `institute_iispp`:

```bash
composer install
php artisan serve
```

The Firebase service-account file must remain outside public web directories and must not be committed. Laravel uses it to upload files to Firebase Storage and save their media metadata and download URL in Firestore. The browser never writes to Storage directly; Storage rules should continue to deny client writes.

## 3. Run the frontend
```bash
npm install
npm run dev        # http://localhost:5173
```

## 4. Deploy the rules, then the website
```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules,storage
npm run build
firebase deploy --only hosting
```
Live at `https://<project-id>.web.app` (add your own domain under Hosting → Add custom domain).
Later updates: `npm run deploy`.

## 5. Create the first administrator

1. Create an account at `/signup` or add it in Firebase Authentication.
2. From `institute_iispp`, run `php artisan cms:make-super-admin your-email@example.com`.
3. Sign in at `/login`. The Laravel API grants the account Super Admin permissions.
4. New sign-ups wait for approval. Administrators can approve them as editors in **Dashboard → Users**.

Tip: on an empty site, click **Load sample content** on the dashboard to see how everything looks, then edit or delete the samples.

## 6. Using the dashboard
| Menu | What it controls on the website |
|---|---|
| News | Home "Latest news", News page, story pages (cover image, category, featured story) |
| Events | Home "Upcoming events", Events page, event pages |
| Programs | Academics page, mega menu, program pages |
| Faculties | Faculty page and detail pages (staff list, contact) |
| Messages | Messages sent from the Contact form |
| Users | Approve accounts as editors or disable their access |
| Settings | Hero headline and photo, About, numbers, Admissions, address, phone, map coordinates, social links |

Every list has **Add**, **Edit**, **Publish / Unpublish** (drafts are hidden from visitors), **Delete** (with confirmation), search and pagination.
Images use the existing fetch/API flow: the admin image picker sends the file as `multipart/form-data` to `POST /api/v1/admin/media` with the current Firebase ID token. Laravel validates the image, uploads it to Firebase Storage, and saves its storage path and `downloadUrl` (the cloud image URL) in a Firestore `media` record. The API returns the media id and URL; content records store the media id, and public content responses include the resolved image URL. Uploads are limited to 5 MB and JPG, PNG, WebP, or GIF. The uploader is in `src/services/storageService.js`; authenticated and public fetch helpers are in `src/services/Api/apiService.js`.

## Folder structure
```
university-system/
├── public/                    favicon (the seal)
├── src/
│   ├── assets/
│   │   ├── images/             campus, library, student, research photos
│   │   └── logos/              logo-full, RUPP logo, institute seal
│   ├── components/
│   │   ├── layout/            Navbar, SearchDialog, Footer, AuthLayout, ConfigBanner
│   │   ├── ui/                Button, Modal, Badge, CoverImage, ImageUpload, MapEmbed, PageHeader ...
│   │   ├── forms/             DynamicForm (builds forms from config), TextField
│   │   ├── tables/            DataTable (search + pagination)
│   │   └── cards/             NewsCard, EventCard, ProgramCard, FacultyCard
│   ├── config/resources.js    fields + columns for every admin screen  <- edit here to add a field
│   ├── layouts/               PublicLayout, DashboardLayout
│   ├── pages/
│   │   ├── public/            Home (+ home/ sections), About, Academics, News, Events, Contact, Search ...
│   │   │   ├── academics/     Faculties, FacultyDetail
│   │   │   └── admissions/    Admissions
│   │   ├── auth/              Login, Signup, ForgotPassword, Profile
│   │   └── admin/             Dashboard, ResourcePage, News/Events/Programs/Faculties, Messages, Users, Settings
│   ├── services/              api/, firebase.js, authService, contentService + collection services
│   ├── hooks/                 useAuth, useLang, useSettings, useCollection, useDocument, useSearchIndex
│   ├── routes/                AppRoutes, AdminRoute, ScrollToTop
│   ├── utils/                 constants, format, i18n (English/Khmer labels), search, validators, seed
│   ├── App.jsx
│   └── main.jsx
├── firestore.rules            who can read/write what
├── storage.rules              admin-only image uploads
├── firebase.json              hosting + SPA routing
└── package.json
```

## Security model
- Browser clients cannot read or write Firestore or Storage directly.
- Laravel checks Firebase ID tokens and applies role-based permissions before content, messages, settings, users, and media operations.
- New accounts receive a pending contributor profile; users cannot assign themselves roles.
- The public Contact API accepts validated, size-limited messages; authorized administrators manage the inbox.

## Customising
- Colours: `src/index.css` (`--color-brand-*` come from the logo's maroon).
- Menu items: `LINKS` in `src/components/layout/Navbar.jsx`.
- English / Khmer interface labels: `src/utils/i18n.js` (content typed in the dashboard is shown as written).
- Default text before an admin edits Settings: `src/utils/constants.js`.

## Notes
- Search runs in the browser over published items (Firestore has no full-text search). Fine for hundreds of items; for thousands, add Algolia or Typesense.
- Deleting a user in the dashboard removes their access record; delete the sign-in account itself in Firebase Authentication if needed.
