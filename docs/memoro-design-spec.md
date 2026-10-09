# Memoro — Product & UI/UX Design Specification

> **Document Type:** Product Brief & UI/UX Specification for AI Design Tools / Designers  
> **Platform:** Progressive Web App (PWA) — Mobile-First (iOS & Android) + Responsive Desktop  
> **Product Name:** Memoro  
> **Target Audience:** Personal lifetime media archive (MVP designed for personal use, 2 users)

---

## 1. Executive Summary & Product Vision

### 1.1 The Core Concept

**Memoro** is a private, lifetime digital archive for photos and videos anchored to two equal, interconnected axes: **Physical Location** and **Time**.

Most photo apps fall into one of two traps:

- **Travel trackers:** Great for short vacations, useless for 10 years of photos taken in one's home city.
- **Cloud galleries (Google Photos / Apple Photos):** Overwhelming endless feeds where geographic context is secondary or buried inside search menus.

**Memoro combines both:** It is equally natural to ask _"Show me what I did in Rome in 2022"_ as it is to explore _"Show me all photos taken in my home neighborhood across the last 10 years, filtered by Summer"_.

### 1.2 Design Philosophy & Aesthetics

- **Content-First (Photos are the Heroes):** The interface must be calm, unobtrusive, and timeless. No loud neon accents, no cluttered social feeds, no algorithmic distractions.
- **Minimalist & Tactile:** Modern iOS/Android aesthetic with high-polish interactions: smooth spring physics, bottom sheets, drag-to-dismiss gestures, subtle haptics.
- **Simple & Clear (Google-style):** Light, airy interface in the spirit of Google products — white surfaces, one blue accent, semantic colors only where they carry meaning. Clarity beats decoration. See §4 for the binding style guide.
- **Light Theme First:** Light theme is the only theme for now. Tokens are structured so a dark theme can be added later as a single override block, without touching components.
- **PWA-Native Feel:** Feels indistinguishable from a native app when installed on a mobile homescreen (fullscreen standalone mode, respects iOS Dynamic Island & notch safe areas, no browser URL bar or bounce artifacts).

---

## 2. Navigation Architecture & Layout

### 2.1 Dual-Axis Navigation

The app revolves around two primary complementary views of the same user library:

1. **Map View:** Spatial perspective. Explores where memories happened.
2. **Feed View (Timeline):** Temporal perspective. Explores when memories happened.

**Synchronized Global Filter:** A global time filter (Year / Period / Season) remains active across both views. Changing the filter to "2023" updates both the map pins and the chronological feed simultaneously.

### 2.2 Navigation Structure

- **Mobile (Primary PWA):** Bottom navigation bar with 4 tabs + 1 central Floating Action Button (FAB):
  1. 🗺️ **Map** (Spatial Explorer)
  2. 📅 **Feed** (Chronological Timeline)
  3. ➕ **Upload (FAB)** (High-visibility action trigger)
  4. 📁 **Collections** (Folders / Trips / Curated Periods)
  5. ⚙️ **Profile & Settings**
- **Desktop / Tablet:** Left-hand collapsible sidebar or sleek top navigation bar, expanding into a dual-pane view (e.g., interactive map on the left, synchronized photo grid on the right).

---

## 3. Screen-by-Screen User Functionality

### 3.1 Onboarding & Permissions

- **Purpose:** Explain critical privacy permissions before requesting them.
- **User Experience:**
  - Friendly 2-step onboarding explaining why location access is needed.
  - **The iOS Constraint Alert:** Educates iOS users that the iOS Photo Picker contains an "Options > Location" toggle that must be enabled when selecting photos, otherwise iOS strips coordinates.
  - Quick option to jump straight to importing existing photos.

---

### 3.2 Main Screen A: Map View (Spatial Explorer)

- **Viewport:** Edge-to-edge interactive vector map (clean typography, subdued cartography so pins stand out).
- **Custom Photo Pins & Clusters:**
  - **Single Photo Pin:** A rounded pill or thumbnail avatar with a crisp white/subtle dark border and drop shadow, showing a photo preview and a small location indicator.
  - **Cluster Pin:** Shows a stack preview thumbnail with a circular counter badge (e.g., `+24`). The cluster center is calculated as the mathematical average of actual media points, never arbitrary municipal coordinates.
- **Cluster Interaction:**
  - Tapping a cluster smoothly animates and zooms into the bounding box containing all child photos.
  - If zoomed in to maximum street level and photos still overlap (e.g., photos taken in the same restaurant), tapping triggers a spiderfy fan-out animation or opens a bottom drawer showing the photo grid for that spot.
- **Floating Controls on Map:**
  - **Top Bar:** Location search input ("Search city, landmark...") and Quick Year Filter pill selector (`All`, `2025`, `2024`, `2023`...).
  - **Right Controls:** Re-center on current user location, toggle map style (Clean Vector / Satellite), and quick switch to Feed view.
  - **Bottom Overlay Card:** When tapping a photo pin, a compact bottom preview sheet slides up showing photo thumbnail, place name, capture date, and collection tag, with a tap to open full-screen.

---

### 3.3 Main Screen B: Feed View (Chronological Timeline)

- **Layout:** Vertical chronological feed grouped cleanly by **Year → Month → Date/Location Header**.
- **Section Headers:** Sticky headers while scrolling (e.g., `September 2025 • Florence, Italy`).
- **Media Grid:**
  - Adaptive masonry or uniform 3-column square grid with subtle spacing.
  - Small indicator icon on photos that lack location data (subtle dotted pin icon).
- **Timeline Scrubber / Quick Jump:**
  - Vertical fast-scroll scrubber on the right edge of the screen displaying years (e.g., `'25`, `'24`, `'23`, `'22'`) allowing instant leaping through decades of memories.

---

### 3.4 Collections (Albums & Folders)

A Collection is a user-defined container for grouped memories. It can represent:

- A specific trip (_"Rome Holiday 2025"_)
- A time period in one's home city (_"Summer 2025"_)
- An ongoing project or theme (_"Road Trips"_)

**Key Product Rules:**

- A photo retains its individual GPS coordinates and capture date regardless of which collection it belongs to.
- Duplicate names are permitted (e.g., multiple collections named "Rome" for different years).
- **Unsorted Media Counter Card:** A dedicated, persistent card at the top of the Collections screen showing media uploaded without a collection assigned (e.g., _"38 Unsorted Photos"_). Users can tap it to batch-assign them to collections or leave them as-is.

**Collection Card Presentation:**

- Large visual card with a dynamic cover photo.
- Collection Title, formatted date range (e.g., _May 12 – May 18, 2024_).
- Geographic summary badge (e.g., _Rome, Florence • 142 photos_).

---

### 3.5 Collection Detail Screen

- **Header:**
  - Immersive hero header with cover image, collection title, date span, and location summary.
  - Action menu: Edit name/dates, change cover, add photos, delete collection.
- **View Switcher:**
  - **Grid Mode:** Clean photo grid of the collection items.
  - **Map Mode:** Focused map view displaying only the pins and itinerary track belonging to this specific collection.
- **Batch Selection Mode:** Long-press any photo to enter selection mode (delete multiple, move to another collection).

---

### 3.6 Media Detail Screen (Full-Screen Viewer & Inspector)

- **Viewer:**
  - High-resolution photo display supporting pinch-to-zoom and double-tap zoom.
  - Horizontal swipe gestures to navigate previous / next media.
  - Swipe down to dismiss back to map or feed.
- **Inspect / Details Sheet (Swipe Up):**
  - **Mini Map:** Interactive preview map with a precise pin showing the exact capture coordinates.
  - **Place Name:** Reverse-geocoded location (e.g., _Piazza Navona, Rome, Italy_).
  - **Interactive Location Editor:** Button to _"Edit Location"_ (opens a draggable pin modal to adjust or assign coordinates).
  - **Date & Time:** Local capture date, local time, and timezone indicator. Option to edit timestamp if metadata was wrong.
  - **Collections:** Tags/pills of collections this photo is part of, with an `+ Add to Collection` button.
  - **File Specs:** Camera model / phone model (e.g., _iPhone 16 Pro, 24mm f/1.78_), resolution, and file size.
  - **Destructive Action:** Trash icon to delete photo permanently.

---

### 3.7 Upload & Ingestion Flow (The Critical User Experience)

The upload process must be painless, fast, and intelligent.

1. **Initiation:**
   - User taps the central `+` FAB or drags-and-drops files on desktop.
   - User selects single or batch photos (e.g., 20 vacation photos).
2. **Client-Side Processing (Instant Feedback):**
   - The browser reads EXIF metadata directly (extracting GPS latitude/longitude and capture timestamp).
   - Generates responsive thumbnail previews locally using HTML Canvas.
3. **Smart Collection Suggestion Dialog:**
   - The app reverse-geocodes the coordinates and suggests a collection name:
     - _"Create new collection: Barcelona"_ (editable text field).
     - _"Add to existing collection: Select from list..."_
     - _"Keep in Unsorted"_ (upload without an album).
4. **Handling Photos Without Geolocation (Legacy & Messenger Photos):**
   - If one or more photos lack GPS data, a dedicated sheet appears:
     - **Option 1: Search by Place Name** (autocomplete search input, e.g. "Colosseum, Rome").
     - **Option 2: Drop Pin on Map** (visual map picker with a draggable crosshair pin).
     - **Option 3: Use Current Location** (convenience button if uploading in real-time).
   - **Batch Assignment:** The location can be applied once to the entire batch of selected photos with a single confirmation tap.
5. **Direct-to-Cloud Upload:**
   - Media uploads directly to Cloudflare R2 storage with smooth progress bars, keeping the UI responsive.

---

## 4. Visual Style Guide & Design System

> This section is binding for all UI work. Tokens live in `apps/client/src/css/variables.css`; shared CSS classes in `apps/client/src/css/main.css`. Components never hardcode colors, shadows, radii or font sizes — always use tokens.

### 4.1 Style Principles

1. **Google-style simplicity.** Light surfaces, generous whitespace, thin `1px` borders instead of heavy shadows, one accent color.
2. **Minimum text.** Every word on screen must earn its place:
   - No subtitles that restate the title ("Sign in to open your archive" — removed).
   - No labels above inputs when the placeholder + leading icon are self-explanatory. The placeholder is mirrored into `aria-label` for accessibility.
   - Titles are one or two words: `Вхід`, `Реєстрація`, `Підтвердження`, `Пароль`.
   - Secondary hints go into the placeholder (`Пароль, від 8 символів`), not into a separate paragraph.
   - Exception: switch links at the bottom of auth screens keep the standard prompt + action form (`Немає акаунту? Зареєструватися`, `Вже маєте акаунт? Увійти`) — a lone link reads as out of context.
   - Visual indicators replace text where possible (step progress bar instead of "Step 1 of 3"; the text survives only as `aria-label`).
3. **One `h1` per screen, describing the task.** The title is kept even when the screen is minimal — it orients the user (especially in multi-step flows) and is what assistive tech announces.
4. **Brand shown once, small.** The logo sits next to the title, with `Memoro` as a small secondary line. No separate hero brand block above the form.
5. **Semantic color only.** Blue = primary action / selection / focus. Green = success. Amber = warning (e.g. media without geolocation). Red = error / destructive. Never use these colors decoratively.
6. **Mobile-first.** On phones, content sits directly on the white page (no card chrome). From `600px` up, content is wrapped in a bordered card on a subtle gray background.

### 4.2 Color Tokens

| Role                                                | Token                                                        | Value                             |
| --------------------------------------------------- | ------------------------------------------------------------ | --------------------------------- |
| Page background                                     | `--color-bg`                                                 | `#FFFFFF`                         |
| Subtle background (desktop page behind cards)       | `--color-bg-subtle`                                          | `#F8F9FA`                         |
| Surface (cards, inputs, toasts)                     | `--color-surface`                                            | `#FFFFFF`                         |
| Surface variant (filled areas, icon circles)        | `--color-surface-variant`                                    | `#F1F3F4`                         |
| Primary                                             | `--color-primary` / `-hover` / `-pressed`                    | `#1A73E8` / `#1765CC` / `#185ABC` |
| Primary container (selected chips, soft highlights) | `--color-primary-container` / `--color-on-primary-container` | `#E8F0FE` / `#174EA6`             |
| Success                                             | `--color-success` / `-container`                             | `#1E8E3E` / `#E6F4EA`             |
| Warning                                             | `--color-warning` / `-container`                             | `#F9AB00` / `#FEF7E0`             |
| Error                                               | `--color-error` / `-container`                               | `#D93025` / `#FCE8E6`             |
| Text                                                | `--color-text-primary` / `-secondary` / `-tertiary`          | `#202124` / `#5F6368` / `#80868B` |
| Borders                                             | `--color-border` / `--color-border-strong`                   | `#DADCE0` / `#BDC1C6`             |
| Hover / pressed overlay                             | `--color-state-hover` / `--color-state-pressed`              | `rgb(60 64 67 / 8%)` / `12%`      |
| Focus ring                                          | `--color-focus-ring`                                         | `rgb(26 115 232 / 24%)`           |

- **Elevation:** `--shadow-1..3` (Google-style soft gray shadows). Prefer borders; use shadows only for floating elements (toasts, map controls, FAB, primary button hover).
- **Map:** light `positron` cartography by default so photo pins stand out.

### 4.3 Typography

- **Font:** Google Sans (loaded from Google Fonts, cached by the service worker for offline use), fallback `Roboto → Segoe UI → system-ui`. Monospace: `Roboto Mono` (verification code, coordinates).
- **Scale tokens:** `--text-xs` 12 · `--text-sm` 14 · `--text-md` 16 · `--text-lg` 18 · `--text-xl` 22 · `--text-2xl` 28 px.
- **Weights:** 400 regular, 500 for titles/buttons/labels. Avoid 700+.
- **Inputs are always ≥ 16px** — prevents iOS auto-zoom on focus (page zoom is not disabled).
- Never use spacing tokens as font sizes.

### 4.4 Shape & Spacing

- **Radii:** `--radius-sm` 4 · `md` 8 (inputs, chips) · `lg` 12 · `xl` 16 · `2xl` 28 (auth card) · `full` (buttons, FAB).
- **Spacing:** 4-px grid via `--space-2xs..3xl` (4, 8, 12, 16, 20, 24, 32, 48).
- **Touch targets:** ≥ 40px (buttons 40/48px, icon buttons 32–44px).

### 4.5 Core Components

- **Buttons (`AppButton`)** — pill-shaped. `primary`: filled blue (main action, one per screen). `secondary`: outlined, blue text. `ghost`: text button, blue text (Back, Cancel, Resend). `danger`: red text on red container. Disabled = 38% opacity; primary is disabled until required fields are filled.
- **Inputs (`AppInput`)** — outlined, 48px, radius 8, leading icon, placeholder as the label. Hover darkens border, focus = 2px blue border. Error = red border + short message below (`.field-message.is-error`).
- **Chips (`AppChipGroup`)** — single-choice options (gender, later year filter). Unselected: outlined gray. Selected: `primary-container` fill + check icon. Rendered as `radiogroup`.
- **Toast (`AppToast`)** — light: white surface, border, `--shadow-2`, status icon inside a 32px tinted circle (error: red on `--color-error-container` + reddish border; success: green on `--color-success-container`; info: blue on `--color-primary-container`), close button. Appears at the top, swipe to dismiss. No dark snackbars.
- **Icon buttons (`AppIconButton`)** — the only round icon button. `plain`: transparent, hover overlay (back, close, password toggle). `floating`: white surface + border + `--shadow-1` (map controls, controls over photos). `active` state = `primary-container` fill. Always has an `aria-label`.
- **Spinner (`AppSpinner`)** — single spinner, inherits `currentColor`.
- **Bottom navigation** — translucent white bar (`--color-surface-translucent` + blur) with a top border; the active item is fully highlighted as a pill (`primary-container` + `on-primary-container`); center FAB is a flat blue circle (no shadow). Hidden on task screens (`meta.hideNav`, e.g. create memory). Keep it translucent: an opaque fixed layer over the WebGL map triggers a compositor artifact (blank strip at the top of the map).
- **Page header (`AppPageHeader`)** — 28px/400 title, optional back button; no separate cancel buttons on task screens.
- **Empty states** — icon in a 72px `primary-container` circle, one-line title, one-line description, optional primary action.
- **Icon semantics** — `mapPin` = a place/address, `target` = my current location, `view3d` = 3D map, `north` = compass. One meaning per icon.
- **Focus:** every interactive element has a visible `:focus-visible` ring (`--color-focus-ring`).
- **Links:** `.text-link` — blue, weight 500, underline on hover.
- **Icons:** each icon is a separate `.svg` file in `src/assets/icons`, colored via `currentColor`.

### 4.6 Form & Screen Pattern (reference: auth screens)

```
[logo 40]  Title (h1, 22px, 500)
           Memoro (14px, secondary)
──────────────────────────────  ← divider, or progress segments in multi-step flows
Optional one-line description (only when it carries data, e.g. "Code sent to a@b.com")
[icon  Placeholder           ]
[icon  Placeholder        👁 ]
Inline link (e.g. Forgot password?)
(        Primary action        )   ← full width, disabled until filled
           Back                    ← ghost, only in multi-step flows
  Prompt? Switch link             ← e.g. "Немає акаунту? Зареєструватися"
```

- Every step is a `<form>` — Enter submits.
- Multi-step flows: max 3 steps, progress shown as thin segments replacing the divider; going back preserves entered data.
- Each auth screen has its own route (`/login`, `/registration`, `/restore`).
- Validation runs on submit; errors appear inline under the field and clear as the user edits. Server errors go to a toast (except code verification, which is shown inline under the code input).

### 4.7 Transactional Emails

- Same visual language as the auth screens: white card (radius 28, `#DADCE0` border) on `#F8F9FA`, header row = logo badge + title + small `Memoro`, divider, one short sentence, content, small footnote.
- Logo is a CSS badge (blue `#1A73E8` rounded square with a white `M`) — SVG is blocked by most mail clients and we have no public image URL yet.
- Verification code: monospace, 32px, letter-spaced, on a `primary-container` (`#E8F0FE`) block.
- Table-based layout with inline styles only; always ship a plain-text alternative.
- Template: `apps/server/src/common/mailer/verification-email.template.ts`.

### 4.8 Key UI Components to Design (feature backlog)

1. **Interactive Photo Pin:** Rounded avatar preview with drop-shadow, cluster badge, and active state pulse.
2. **Bottom Sheet Modal:** Spring-animated bottom drawer for mobile (filters, location editing, photo inspector).
3. **Year/Timeline Filter Bar:** Horizontal scrollable chips (`All`, `2025`, `2024`…) built on `AppChipGroup`.
4. **Photo Card (Feed Grid):** Rounded thumbnail with optional location badge (amber when geolocation is missing).
5. **Collection Card:** Cover photo with gradient scrim, title, date range, photo count.
6. **Location Picker Modal:** Map with centered crosshair pin and address search bar.
7. **Floating Action Button (Upload FAB):** Blue circular button in the bottom navigation.

---

## 5. Summary Checklist for the AI Design Tool

When generating screens or prototypes, ensure the design captures:

- [ ] **Screen 1: Map View (Home)** with photo thumbnails as map pins, clustering, and top year filter chips.
- [ ] **Screen 2: Feed View** with sticky date/location headers, multi-column photo grid, and timeline scrubber.
- [ ] **Screen 3: Collection Directory** with collection cards and the prominent "Unsorted" counter card.
- [ ] **Screen 4: Collection Detail View** with cover hero, photo grid, and toggle to view collection map.
- [ ] **Screen 5: Media Detail / Fullscreen Viewer** with swipe-up metadata drawer showing mini-map and EXIF details.
- [ ] **Screen 6: Upload & Location Resolver Modal** showing collection suggestion and map pin placement for photos without GPS.
