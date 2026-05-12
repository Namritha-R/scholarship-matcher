# SkolarX — How the Search & Matching Process Works

## Table of Contents
1. [Overview](#overview)
2. [Where the Data Comes From](#where-the-data-comes-from)
3. [The Smart Profile System](#the-smart-profile-system)
4. [Country-Aware Academic Fields](#country-aware-academic-fields)
5. [The Matching Algorithm](#the-matching-algorithm)
6. [Score Normalization Across Countries](#score-normalization-across-countries)
7. [Live Web Search Discovery](#live-web-search-discovery)
8. [How Results Are Displayed](#how-results-are-displayed)
9. [Filtering & Sorting](#filtering--sorting)
10. [Saved Scholarships & Export](#saved-scholarships--export)

---

## 1. Overview

SkolarX uses a **hybrid data + live search** approach with automated updates:

- **Firebase Firestore Database**: A cloud database storing structured scholarship records. It initially contains a seed list of 45+ real-world scholarships with rich metadata.
- **Auto-Updater (Cloud Functions)**: A serverless backend function that runs periodically to fetch fresh data from the internet (using free scraping/feeds) and updates Firestore.
- **Frontend Fallback**: If the database is unreachable, the app automatically falls back to a static local database (`scholarships.js`) to ensure zero downtime.
- **Live Web Search**: In addition to database results, the app generates **dynamic Google search URLs** customized to the user's profile to discover additional scholarships in real-time.

The curated database exists because a matching algorithm requires **structured data** to compute compatibility scores. Raw web search results cannot be scored — they are unstructured text. The hybrid approach gives users the best of both worlds.

---

## 2. Where the Data Comes From

### 1. Firebase Firestore (`scholarships` collection)
The primary source of truth is a Firestore database. Each scholarship entry is a structured object with:

| Field | Description | Example |
|-------|-------------|---------|
| `name` | Official scholarship name | "Fulbright Foreign Student Program" |
| `org` | Granting organization | "U.S. Department of State" |
| `level` | Eligible education levels (array) | ["Masters", "PhD"] |
| `field` | Eligible fields of study (array) | ["Any"] or ["STEM", "Engineering"] |
| `country` | Host country | "USA" |
| `region` | Geographic region | "USA", "Europe", "Asia", "Global" |
| `amount` | Human-readable funding | "Full Funding" or "$50,000/year" |
| `amountNum` | Numeric value for sorting/filtering | 70000 |
| `deadline` | Application deadline month | "Oct" |
| `description` | Detailed description | Full paragraph about the program |
| `eligibility` | Structured eligibility object | See below |
| `link` | Official application URL | "https://foreign.fulbrightonline.org/" |
| `tags` | Quick-glance labels | ["Prestigious", "Full Funding"] |

### 2. Auto-Update Function (`functions/index.js`)
To keep the data fresh without manual work or budget:
- The backend uses a Cloud Function that can be triggered on a schedule (Cron Job).
- It attempts to fetch data from public JSON lists or RSS feeds (Free & Efficient).
- If external sources fail, it falls back to a verified list of fresh scholarships to ensure database health.

### 3. Curated Fallback (`js/data/scholarships.js`)
If the user is offline or the Firebase connection fails, the app reads directly from this file. This ensures the app is always functional.

### 4. Live Web Search URLs (`buildScholarshipSearchURLs()`)
After displaying matched results, the system generates Google search links like:
```
https://www.google.com/search?q=Masters+Computer+Science+scholarships+in+USA+for+India+students+2026
```
These are dynamically constructed from the user's profile fields.

---

## 3. The Smart Profile System

The user fills a **5-step wizard**:

| Step | Name | Fields Collected |
|------|------|-----------------|
| 1 | **Personal** | Name, Age, Nationality, Country of Residence, Gender |
| 2 | **Education & Destination** | Education Level, Field of Study, Institution, Study Abroad checkbox, Destination preferences |
| 3 | **Academics** | Country-specific academic scores, entrance exams, standardized tests |
| 4 | **Eligibility** | Financial need, Minority status, Work experience |
| 5 | **Extras** | Extracurriculars, achievements, research |

### Key Design Principle: Progressive Profiling
- Users are NOT forced to fill every field
- Optional fields are clearly marked
- The form works with minimal input (just level + nationality gives useful results)
- More data = more accurate matching

---

## 4. Country-Aware Academic Fields

**This is a critical feature.** Different countries use completely different grading
and examination systems. The form adapts Step 3 (Academics) based on the user's
nationality selected in Step 1.

### How It Works

When a user selects their nationality, the system looks up a country-specific
configuration from `ACADEMIC_SYSTEMS`:

### India 🇮🇳
| Field | What's Shown |
|-------|-------------|
| Main Score | **12th Marks / Percentage** (out of 100%) |
| UG Entrance | JEE Main/Advanced Percentile, NEET Score, CUET Score |
| PG Entrance | GATE Score, CAT Percentile |
| Abroad Tests | TOEFL, IELTS, GRE, GMAT (shown when "Study Abroad" is checked) |

### USA 🇺🇸
| Field | What's Shown |
|-------|-------------|
| Main Score | **High School GPA** (out of 4.0) |
| UG Entrance | SAT Score, ACT Score |
| PG Entrance | GRE Score, GMAT Score |
| Abroad Tests | None (English-native country) |

### UK 🇬🇧
| Field | What's Shown |
|-------|-------------|
| Main Score | **A-Level Grades / UCAS Points** (out of 200) |
| UG Entrance | None (A-Levels serve as entrance) |
| PG Entrance | None |
| Abroad Tests | IELTS (shown when "Study Abroad" is checked) |

### Germany 🇩🇪
| Field | What's Shown |
|-------|-------------|
| Main Score | **Abitur Grade** (1.0 best to 6.0 worst) |
| Abroad Tests | TOEFL, IELTS, TestDaF |

### Japan 🇯🇵
| Field | What's Shown |
|-------|-------------|
| Main Score | **High School GPA / Percentage** (out of 5.0 or %) |
| UG Entrance | EJU Score |
| Abroad Tests | TOEFL, IELTS, JLPT |

### Australia 🇦🇺
| Field | What's Shown |
|-------|-------------|
| Main Score | **ATAR Score** (out of 99.95) |
| Abroad Tests | IELTS, TOEFL, PTE |

### Canada 🇨🇦
| Field | What's Shown |
|-------|-------------|
| Main Score | **High School Average** (%) |
| PG Entrance | GRE Score |
| Abroad Tests | IELTS, TOEFL |

### South Korea 🇰🇷
| Field | What's Shown |
|-------|-------------|
| Main Score | **CSAT Score / Rank** (out of 400) |
| Abroad Tests | TOEFL, IELTS, TOPIK |

### China 🇨🇳
| Field | What's Shown |
|-------|-------------|
| Main Score | **Gaokao Score / Percentage** (out of 750) |
| Abroad Tests | TOEFL, IELTS, GRE |

### All Other Countries
| Field | What's Shown |
|-------|-------------|
| Main Score | **High School Score / GPA** (generic) |
| Abroad Tests | TOEFL, IELTS, GRE, GMAT |

---

## 5. The Matching Algorithm

The algorithm is in `js/engine/matcher.js`. For **each scholarship** in the database,
it computes a compatibility score from 0% to 100% based on the user's profile.

### Scoring Breakdown (Total: 100 points)

| # | Criterion | Max Points | Logic |
|---|-----------|-----------|-------|
| 1 | **Education Level** | 25 | Exact match = 25pts. Adjacent level (e.g., UG applying to Masters scholarship) = 10pts. Non-adjacent = **0 (hard filter — scholarship skipped)**. |
| 2 | **Field of Study** | 20 | Exact match = 20pts. Related field (e.g., CS → Engineering) = 10pts. Scholarship open to "Any" field = 20pts. |
| 3 | **Region/Destination** | 15 | User's preferred destination matches scholarship country/region = 15pts. Global scholarship = 12pts. No preference set = 15pts. |
| 4 | **Academic Merit (GPA)** | 15 | Meets minimum GPA = 15pts. Within 0.3 of requirement = 8pts. Below = 0pts. |
| 5 | **Financial Need** | 10 | Scholarship requires financial need + user has it = 10pts. No requirement = 10pts. User doesn't have need but scholarship requires it = 3pts. |
| 6 | **Special Criteria** | 15 | Gender match (for women-only scholarships) + minority status. Full match = 15pts. Partial = proportional. |

### Hard Filter
If the user's education level is **not adjacent** to the scholarship's target level,
the scholarship is immediately scored 0 and excluded. This prevents showing PhD
scholarships to school students.

### Scoring Formula
```
finalScore = (earnedPoints / maxPossiblePoints) × 100
```

---

## 6. Score Normalization Across Countries

Since scholarships specify GPA requirements on a 4.0 scale, the system **normalizes**
all country-specific scores to a 4.0 GPA equivalent for comparison.

### Normalization Formulas

| Country | Input | Formula | Example |
|---------|-------|---------|---------|
| India | 85% (12th marks) | `(85 / 100) × 4.0` = **3.4 GPA** | 85% → 3.4 |
| USA | 3.8 GPA | Already on 4.0 scale = **3.8 GPA** | 3.8 → 3.8 |
| UK | 144 UCAS points | `(144 / 200) × 4.0` = **2.88 GPA** | 144 → 2.88 |
| Germany | 1.5 Abitur | `((6 - 1.5) / 5) × 4.0` = **3.6 GPA** | 1.5 → 3.6 |
| Australia | 92 ATAR | `(92 / 99.95) × 4.0` = **3.68 GPA** | 92 → 3.68 |
| China | 620 Gaokao | `(620 / 750) × 4.0` = **3.31 GPA** | 620 → 3.31 |
| South Korea | 3.8 / 4.5 | `(3.8 / 4.5) × 4.0` = **3.38 GPA** | 3.8 → 3.38 |
| Japan | 4.2 / 5.0 | `(4.2 / 5.0) × 4.0` = **3.36 GPA** | 4.2 → 3.36 |

The normalization happens in the `normalizeToGPA()` function in `form.js`.

---

## 7. Live Web Search Discovery

After displaying the matched results from the curated database, a **"Discover More
Scholarships on the Web"** section appears at the bottom of the results page.

### How Search URLs Are Generated

The `buildScholarshipSearchURLs()` function constructs search queries from the
user's profile:

```
Input:  { level: "Masters", field: "Computer Science", destinations: ["USA", "UK"] }
Output:
  - "Masters Computer Science scholarships 2026 international students"
  - "Masters scholarships in USA for international students 2026"
  - "Masters scholarships in UK for international students 2026"
```

These are rendered as clickable buttons that open Google Search in a new tab.

### Why This Approach?
- **No API costs** — uses standard Google Search links
- **Always up-to-date** — Google indexes scholarship websites in real-time
- **Targeted queries** — customized to the user's specific profile
- **User maintains control** — they see and click the search, not an automated scraper

---

## 8. How Results Are Displayed

### Results Page Layout
```
┌─────────────────────────────────────────────────────┐
│  Your Matched Scholarships                          │
│  Showing 41 of 41 matched scholarships   [Sort ▾]  │
├──────────┬──────────────────────────────────────────┤
│ FILTERS  │  ┌─────────────────┐ ┌────────────────┐ │
│          │  │ Fulbright  100% │ │ Chevening 100% │ │
│ Level    │  │ USA • Masters   │ │ UK • Masters   │ │
│ □ School │  │ Full Funding  ♡ │ │ Full Funding ♡ │ │
│ □ UG     │  └─────────────────┘ └────────────────┘ │
│ □ Masters│                                          │
│ □ PhD    │  ┌─────────────────┐ ┌────────────────┐ │
│          │  │ DAAD       92%  │ │ Erasmus   88%  │ │
│ Region   │  │ Germany • Mast. │ │ Europe • Mast. │ │
│ □ USA    │  │ €934/month   ♡  │ │ €25,000    ♡   │ │
│ □ UK     │  └─────────────────┘ └────────────────┘ │
│ □ Europe │                                          │
│          │  ┌─ Discover More on the Web ──────────┐ │
│ Amount   │  │ 🌐 Search Google │ UK Scholarships  │ │
│ ──●───── │  └────────────────────────────────────┘ │
└──────────┴──────────────────────────────────────────┘
```

### Scholarship Card Elements
- **Match Percentage Badge** (circular, color-coded):
  - Green (≥80%) = High match
  - Yellow (50-79%) = Medium match
  - Red (<50%) = Low match
- **Scholarship Name** and **Organization**
- **Quick Details**: Country, Level, Deadline/Status
  - If the scholarship is closed but will reopen, it displays: `Closed (Opens: [Approx. Date])`.
  - Deactivated scholarships are automatically hidden from view.
- **Tags**: "Prestigious", "Full Funding", "Research", etc.
- **Funding Amount**: Displayed in green
- **Save Button (♡)**: Toggle to save/unsave

### Detail Modal (click a card)
- Full match percentage with color ring
- 3-column stats: Funding | Country | Deadline
- Full description
- Eligibility checklist with ✓/✗ indicators
- Tags
- "Apply Now" button → opens official scholarship website
- "Save" button

---

## 9. Filtering & Sorting

### Available Filters (Left Sidebar)
| Filter | Options |
|--------|---------|
| Education Level | School, Undergraduate, Masters, PhD, Postdoctoral, Professional |
| Region | USA, UK, Europe, Canada, Australia, Asia, Africa, Middle East, Latin America, New Zealand |
| Minimum Amount | Slider: $0 to $90,000 |

### Sort Options
| Sort | Behavior |
|------|----------|
| Best Match (default) | Highest match percentage first |
| Highest Amount | Largest funding amount first |
| Alphabetical | A → Z by scholarship name |

### Active Filter Chips
Applied filters appear as removable tags at the top of the results:
```
[Masters ×] [USA ×] [Min $20,000 ×]   Clear All
```

### Zero Results Handling
If filters produce no results, a friendly message appears:
> "No Matches Found. Try adjusting your filters or broadening your profile preferences."
> [Clear All Filters]

---

## 10. Saved Scholarships & Export

### Saving
- Click the ♡ heart button on any scholarship card or the "Save" button in the modal
- Saved scholarships are stored in **browser LocalStorage** (device-specific)
- A toast notification confirms the action

### Tracker Page
- Shows all saved scholarships in a card grid
- Each card shows: name, organization, country, deadline badge, tags, amount
- "Apply ↗" button for each saved scholarship
- "×" button to remove from saved

### CSV Export
- Click "Export CSV" to download all saved scholarships as a spreadsheet
- Includes: Name, Organization, Amount, Country, Deadline, Link

### Data Persistence
- Saved scholarships persist across browser sessions (LocalStorage)
- Profile data is also saved so users can return to results without re-filling the form
- Theme preference (dark/light) persists

---

## Architecture Summary

```
User fills Profile Form (country-aware)
          ↓
  Raw scores normalized to 4.0 GPA
          ↓
  Matching Engine scores each scholarship (0-100%)
          ↓
  Results sorted by match %
          ↓
  ┌─────────────────────────────────────┐
  │  Curated Results (scored & ranked)  │
  │  + Live Web Search Links            │
  │  + Filters & Sorting                │
  │  + Save & Export                    │
  └─────────────────────────────────────┘
```

---

*Last Updated: May 2026 | SkolarX v1.0*
