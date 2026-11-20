# COA Atlas

COA Atlas is a local-first Computer Organization and Architecture study platform aligned to the **Course Handout 2026** lecture sequence. The current platform uses seven chapters, a source-tracked syllabus, guided lessons, numerical practice, a hand-trace assembly lab, formula reference, formative chapter checks, and browser-local progress.

## Run locally

Requirements: Node.js 20.19+ or 22.12+.

```powershell
npm install
npm run dev
```

Create a production build with `npm run build`; preview it with `npm run preview`.

## Platform structure

- `src/data/syllabus.js` — the seven chapters, handout lecture sequence, topics, and subtopics.
- `src/data/sourceManifest.js` — available source records, per-topic evidence mapping, and unavailable materials.
- `src/data/lessons.js` — structured lesson content, generated numerical exercises, formulas, and chapter checks.
- `src/components/` — reusable navigation, lesson rendering, and study pages.
- `src/App.jsx` — hash-based navigation, search, progress persistence, bookmarks, theme, source registration, and backup.
- `legacy.html`, `app.js`, and `styles.css` — the pre-existing eleven-section notes archive retained during the platform transition.

## Content and evidence policy

The supplied handout and six extracted slide-deck groups (weeks 3, 4, 9, 10, 11, and 12) are registered in the source manifest. Several topics have a handout outline but do not yet have detailed source-verified lessons; those are explicitly marked pending and cannot be marked as studied. Generated practice and quiz items are labeled as generated, not past-paper questions.

The 2024–2025 examination papers, tutorials, solutions, marking schemes, and question bank are not currently present in the workspace. The past-paper page therefore reports them as unavailable and does not invent questions, frequencies, marks, or exam-priority statistics. Registering a file in Settings stores its filename and metadata locally; it does not upload, extract, or verify its contents.

The seven-chapter structure and lecture ordering follow the supplied prompt and Course Handout 2026. Syllabus-focus labels are not estimates of a future marks distribution.

## Local data

Study progress, practice state, quiz results, bookmarks, appearance settings, and registered source-file metadata are stored in browser `localStorage`. Use Settings to export a progress backup. Data is specific to the browser and device.
