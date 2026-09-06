# Memoro — Specification

**Working Title:** Memoro `❓` (verify domain, app store availability, trademarks)  
**Status:** Draft, concept stage  
**Version:** 0.3  
**Companion Document:** `memoro-tech.md` — Technical Requirements  

**Legend:**  
`✅` — Included in MVP  
`⬜` — Post-MVP, planned for future  
`❓` — Unresolved  

---

## 1. Product Core

A lifetime storage for media anchored to physical locations. A single place for memories spanning an entire life.

**This is not just a travel app.** Trips are merely one use case. It is equally common to photograph the same city for years, organizing media by periods: "Summer 25", "Winter 25".

Two equal axes of navigation: **location** and **time**.

## 2. Platform

A single web application operating as a PWA on iOS and Android, and as a standard website on desktop. No separate native builds are planned.

## 3. Core Constraint

For media coordinates to reach the application, two conditions must be met:

1. **The photo must contain geolocation data.** The camera writes it upon shooting if location access is granted.
2. **Location must be enabled in the picker** — relevant exclusively for iOS. In the system photo picker, there is an Options menu with a Location toggle.

On Android and desktop, the first condition is sufficient.

**Product Consequence:** On iOS, this toggle is disabled by default and applies only to the current selection, meaning it must be turned on every time. Additionally, a portion of media lacks geolocation data entirely — photos taken with location disabled, screenshots, photos sent via messengers, as well as any legacy archives: film scans, print scans, feature phone photos.

**Priority:** The primary workflow is designed for new photos where geolocation data is typically present. For legacy archives, location is assigned manually — this is expected behavior, not a failure.

**Edge Case:** Photos taken directly with the browser camera do not receive coordinates even with Location enabled.

---

# 4. Features

## 4.1 Profile ✅

- Account is mandatory from version 1.
- Media cannot be lost: reliable storage, multi-device access.
- Friends, public profiles, subscriptions — `⬜`

## 4.2 Collections ✅

A collection is a folder of grouped media. It can represent a trip ("Rome"), a time period ("Summer 25"), or a theme. Each photo inside retains its own coordinates.

- Create, view, edit, delete.
- Arbitrary names. Duplicate names are permitted.
- On name conflict, display a soft hint: "You already have a collection named 'Rome' — open it or create a new one?". No blocking.
- **Collection identity does not depend on tags.** Rationale: tags are editable; removing a tag from one collection could collide with another, violating uniqueness rules.
- A collection can span multiple cities ("Italy" = Rome + Florence + Venice) or a single location over an extended period.

## 4.3 Collection Suggestion on Upload ✅

The application **never creates collections automatically without consent**. It recognizes the location from media coordinates and suggests a ready-made name.

During upload, the user sees a choice:
- **Create new collection** — prefilled with the location name ("Barcelona");
- **Add to existing** — selected from a list of existing collections.

**Requirements:**
- The suggested name is immediately editable before creation. Reverse geocoding will yield "Barcelona" or "Kyiv" — suitable for trips, but for home photos the user will almost always rename it.
- Suggestions are non-intrusive: the existing collection list is displayed alongside, and suggestions can be ignored.

Rationale: Automatic creation based on "location + time period" works for trips, but for the user's hometown, it would generate a new collection every week.

## 4.4 Unsorted Media ✅

Media added without selecting a collection enters the "unsorted" state.

- This is **not** a regular collection. Displayed as a separate counter block, unmixed with the collection list.
- Once added to a real collection, it is removed from unsorted.
- Goal: allow quick file uploads without having to invent folder names on the spot.

## 4.5 Media and Collection Relationships

- Data model — **many-to-many, laid out from day one** `✅`. This is a schema architectural decision, not a feature: migrating later would be costly.
- MVP UI adds media to a single collection `✅`
- Curated sets, i.e., a single photo in multiple collections ("Best of 2025") — `⬜`
- Separating actions "remove from collection" and "delete permanently" — required alongside curated sets `⬜`

## 4.6 Tags ❓

- Freeform, user-created.
- Not strictly limited in quantity. The UI displays the first 2–3 tags and collapses the rest.
- No impact on collection visibility or uniqueness.
- **Unresolved:** Whether to include in MVP. Without public sharing and searching across external collections, tag filtering across a couple dozen personal folders provides little value.

## 4.7 Visibility ⬜

- **Dedicated collection field**, not managed via tags. Rationale: a user tagging a collection as "personal" expects it to be hidden.
- States: public / hidden / restricted to selected users.
- **Privacy:** A public collection with exact coordinates exposes where a person lives — a single home photo is enough. For public collections, coordinate rounding is required. Must be implemented simultaneously with public visibility, not later.
- **To clarify:** "Restricted to selected" — all registered users or specific invitees. These represent two substantially different scopes of work.

## 4.8 Media Location Resolution ✅

**File contains geolocation** → Use it directly. No user action required.

**File lacks geolocation** → Present choices:
- **Set manually** — map pin or search by location name;
- **My current geolocation** — offered as a suggestion, with an adjustable pin.

**Requirements:**
- Location is never applied silently. The user reviews and confirms.
- Rationale: a user organizing an archive at home would otherwise have all vacation photos mapped to their backyard.
- Searching location by name is standard workflow for legacy archives, not an edge case.

**Post-upload editing:** Location can be modified later.

## 4.9 Batch Upload ✅

The most frequent scenario involves dozens of files from a single location, particularly during initial archive import to populate the map quickly.

- Location is selected once for the entire batch; confirmation is also performed once.
- Item-by-item confirmation is prohibited as the primary flow.

## 4.10 Date ✅

Date is the second primary axis of navigation alongside location. In an archive spanning years, "show 2019" is as natural a query as "show Rome".

**Requirements:**
- Preserve capture date from metadata when available.
- Store **local capture date**, not just an absolute timestamp in UTC. A photo taken in Tokyo at 23:00 belongs to the next day in Kyiv time — without timezone offset awareness, trips split across day boundaries.
- `❓` Verify capture date metadata retention on iOS on a real device. If stripped, fallback to upload date with manual editing capability.

## 4.11 Navigation & Views: Two Modes ✅

Primary navigation consists of two equal modes.

### Map
- Clustering: points group together at distant zoom levels and disperse upon zooming in.
- **Cluster center** — mathematical mean of actual media coordinates, not country/city geographic center. Otherwise, tapping a pin points to places the user never visited.
- **Tapping a cluster** smoothly zooms to fit all contained points within the viewport.
- **Pin content** — thumbnail preview plus media counter. A map with thumbnails is far more readable than uniform dots.
- Must operate meaningfully across all scales: from continental views (multiple overseas trips) to neighborhood blocks (thousands of photos in a hometown).
- `❓` Initial map position on launch. Centering on current user location fails when traveling, showing an empty map instead of the user's archive. Alternatives: last viewed position or densest cluster of media.
- `❓` Mixed clusters: "Rome 2025" and "Rome 2026" will geographically merge into a single pin. What to display on tap — list of collections, separate clusters, or a "by places / by collections" toggle.

### Feed Panel
- Media cards with filters. Date filter is mandatory.
- Dedicated view/screen, not an overlay on top of the map.

### Synchronized Filters
Filters apply to both modes simultaneously. Setting a specific year yields the identical dataset both on the map and in the feed. Otherwise, users will be confused by discrepancies between views.

## 4.12 Collection Screen ✅

- Displays contents of an individual collection.
- `❓` Primary presentation: grid, map, or day-by-day feed.

## 4.13 Media Detail Screen ✅

- File viewing.
- Location editing.
- `❓` Caption and description.

## 4.14 Deletion ✅

- Deleting individual media and collections.
- `⬜` Bulk operations, moving between collections.

## 4.15 Onboarding ✅

Explain why the application requests geolocation permission and why it occasionally prompts for where a photo was taken. Without this, the behavior appears buggy.

---

# 5. Open Questions

1. **Name.** Memoro — check domain availability, app stores, trademarks.
2. **Tags in MVP** — include or defer. See 4.6.
3. **Capture date on iOS** — verify behavior on a physical device. See 4.10.
4. **Initial map position.** See 4.11.
5. **Mixed clusters** from different collections. See 4.11.
6. **Primary collection view** — grid, map, or feed. See 4.12.
7. **"Restricted to selected"** — all registered users or specific invitees. See 4.7.
8. **Media types** — photos only or videos as well. The document uses the term "media", but video handling is not yet specified.
9. **Import from external services** — Google Photos, iCloud.

---

# 6. Implementation Details

Selection of geocoder, map tile provider, media storage, and database — refer to `memoro-tech.md`.
