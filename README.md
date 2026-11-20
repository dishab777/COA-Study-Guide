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
- `src/data/sourceManifest.js` — available source records, page/slide locators, per-topic evidence mapping, and remaining gaps.
- `src/data/lessons.js` — authored lessons, generated and tutorial-derived numerical exercises, formulas, and chapter checks.
- `src/data/examBank.js` — paraphrased question indexes for distinct supplied examination sets and tutorial sheets.
- `src/components/` — reusable navigation, lesson rendering, and study pages.
- `src/App.jsx` — hash-based navigation, search, progress persistence, bookmarks, theme, source registration, and backup.
- `legacy.html`, `app.js`, and `styles.css` — the pre-existing eleven-section notes archive retained during the platform transition.

## Content and evidence policy

The source manifest registers the Course Handout 2026, the week 3/4/9/10/11/12 slide groups, and the additional lecture-unit PDFs, PowerPoint, PDF, tutorial, formula, and practice materials supplied with the course. Text was extracted locally from the documents; image-based references were treated as scans where applicable. All 46 syllabus topics now have authored lessons, with page, slide, or paragraph locators where verified. Examples in the lessons are teaching examples, not claims about past exam content.

The question bank indexes eight distinct examination sets and 95 question entries. Question summaries are paraphrased and retain source question numbers, marks, and page/paragraph locators; consult the cited original for exact wording and figures. A byte-identical December 2025 paper copy is excluded. Unmatched solution documents and source-answer assumptions are flagged rather than silently treated as authoritative. No question-frequency or exam-priority statistics are inferred.

Supplied current-year tutorials are listed separately from past papers. Selected tutorial problems have independently checked workings in Numerical practice; they are labeled as tutorial-derived, not as official answer keys or examination questions. Registering a file in Settings stores its filename and metadata locally; it does not upload, extract, or verify its contents.

The seven-chapter structure and lecture ordering follow the supplied prompt and Course Handout 2026. Syllabus-focus labels are not estimates of a future marks distribution.

## Local data

Study progress, practice state, quiz results, bookmarks, appearance settings, and registered source-file metadata are stored in browser `localStorage`. Use Settings to export a progress backup. Data is specific to the browser and device.
