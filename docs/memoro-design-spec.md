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
- **Dual Theme Support:** Deep dark mode (true blacks for OLED displays to make photography pop) and clean, warm light mode.
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

## 4. UI Components & Design System Guidance

### 4.1 Color Palette

- **Backgrounds:**
  - _Dark Mode:_ Pure background `#090A0C`, Card/Surface `#14161B`, Elevated Surfaces `#1E222A`.
  - _Light Mode:_ Pure background `#F8F9FA`, Card/Surface `#FFFFFF`, Elevated Surfaces `#EDF0F3`.
- **Primary Accent:** Warm terracotta or deep amber (e.g., `#E0684B` or `#D97706`) — evokes warmth, archival memory, physical photo albums, without being loud or distracting.
- **Map Theme:** Muted grayscale base cartography (dark charcoal in dark mode, soft warm gray in light mode) with high-contrast color pop for photo pins.

### 4.2 Typography

- Modern geometric sans-serif (e.g., Inter, Plus Jakarta Sans, SF Pro Display).
- Clear hierarchy: large expressive editorial titles for Collections, clean tabular numerals for dates and coordinates.

### 4.3 Key UI Components to Design

1. **Interactive Photo Pin:** Rounded avatar preview with drop-shadow, unread/cluster badge, and active state pulse.
2. **Bottom Sheet Modal:** Spring-animated bottom drawer for mobile (used for filters, location editing, photo inspector).
3. **Year/Timeline Filter Bar:** Horizontal scrollable chips (`All`, `2025`, `2024`, `2023`, `2022`...) with active pill indicator.
4. **Photo Card (Feed Grid):** Rounded corner media thumbnail with optional subtle location badge overlay.
5. **Collection Card:** Visual cover card with gradient scrim overlay, title, date range, and photo count.
6. **Location Picker Modal:** Interactive map widget with centered crosshair pin and address search bar.
7. **Floating Action Button (Upload FAB):** Prominent elevated circular or rounded pill button.

---

## 5. Summary Checklist for the AI Design Tool

When generating screens or prototypes, ensure the design captures:

- [ ] **Screen 1: Map View (Home)** with photo thumbnails as map pins, clustering, and top year filter chips.
- [ ] **Screen 2: Feed View** with sticky date/location headers, multi-column photo grid, and timeline scrubber.
- [ ] **Screen 3: Collection Directory** with collection cards and the prominent "Unsorted" counter card.
- [ ] **Screen 4: Collection Detail View** with cover hero, photo grid, and toggle to view collection map.
- [ ] **Screen 5: Media Detail / Fullscreen Viewer** with swipe-up metadata drawer showing mini-map and EXIF details.
- [ ] **Screen 6: Upload & Location Resolver Modal** showing collection suggestion and map pin placement for photos without GPS.
