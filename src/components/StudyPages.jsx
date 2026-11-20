import { useState } from 'react';
import {
  ArrowLeft, ArrowRight, Award, Bookmark, Check, CheckCircle2, ChevronRight,
  CircleHelp, ClipboardCheck, Clock3, Download, FileQuestion, Filter, Lightbulb,
  LockKeyhole, Sparkles, Target,
} from 'lucide-react';
import ProgressBar from './ProgressBar.jsx';
import LessonContent from './LessonContent.jsx';
import { chapters, allTopics } from '../data/syllabus.js';
import { formulaBook, lessonLibrary, practiceProblems, quizBank } from '../data/lessons.js';
import { examPapers, tutorialSets, unmatchedExamSources } from '../data/examBank.js';
import { getTopicEvidence, sources, unavailableSources } from '../data/sourceManifest.js';

const priorityClass = (priority) => priority.toLowerCase().replace(/\s+/g, '-');
const pct = (done, total) => total ? Math.round((done / total) * 100) : 0;
const topicById = (id) => allTopics.find((topic) => topic.id === id);
const chapterById = (id) => chapters.find((chapter) => chapter.id === id);
const sourceNamesFor = (topic) => getTopicEvidence(topic).sourceIds.map((id) => sources.find((source) => source.id === id)?.filename).filter(Boolean);

function StatCard({ label, value, note, Icon }) {
  return <article className="stat-card"><span className="stat-icon"><Icon size={18} /></span><div><span className="stat-label">{label}</span><strong>{value}</strong><small>{note}</small></div></article>;
}

function ChapterCard({ chapter, progress, onNavigate }) {
  const rows = chapter.topics.map((topic) => progress[topic.id] || {});
  const theoryDone = rows.filter((item) => item.theory).length;
  const practiceDone = rows.filter((item) => item.practice).length;
  const remaining = chapter.topics.length - theoryDone;
  return (
    <article className="chapter-card">
      <div className="chapter-card-top"><span className="chapter-number">CHAPTER {String(chapter.number).padStart(2, '0')}</span><span className={`priority priority-${priorityClass(chapter.priority)}`}><Target size={12} />{chapter.priority}</span></div>
      <h3>{chapter.title}</h3>
      <p className="chapter-lectures">Course Handout · Lectures {chapter.handoutLectures}</p>
      <ProgressBar value={pct(theoryDone, chapter.topics.length)} label="Theory" compact />
      <div className="chapter-card-foot"><span>{theoryDone}/{chapter.topics.length} studied · {remaining} remaining</span><span>{pct(theoryDone, chapter.topics.length)}% · {practiceDone} practice</span></div>
      <button className="button button-primary full-width" onClick={() => onNavigate(chapter.id)}>Continue chapter <ArrowRight size={15} /></button>
    </article>
  );
}

export function Dashboard({ progress, practiceState, quizScores, studyStreak, onNavigate }) {
  const theoryCount = allTopics.filter((topic) => progress[topic.id]?.theory).length;
  const completedProblems = practiceProblems.filter((problem) => practiceState[problem.id]?.complete).length;
  const revisionCount = allTopics.filter((topic) => progress[topic.id]?.needsReview).length;
  const chaptersPassed = chapters.filter((chapter) => (quizScores[chapter.id]?.best || 0) >= 80).length;
  return (
    <div className="page-stack">
      <header className="page-heading">
        <div><div className="eyebrow">YOUR COURSE HOME</div><h1>Build understanding, one topic at a time.</h1><p>Seven chapters follow the Course Handout 2026 sequence. Progress is separated into theory, practice, and exam readiness.</p></div>
        <button className="button button-secondary" onClick={() => onNavigate('syllabus')}>View complete syllabus <ArrowRight size={16} /></button>
      </header>
      <section className="stats-grid" aria-label="Study statistics">
        <StatCard label="Theory lessons" value={`${theoryCount}/${allTopics.length}`} note={`${pct(theoryCount, allTopics.length)}% read`} Icon={BookOpenIcon} />
        <StatCard label="Numericals solved" value={completedProblems} note={`${practiceProblems.length} guided practice problems`} Icon={CheckCircle2} />
        <StatCard label="Chapter tests passed" value={chaptersPassed} note="80% or higher; not a past-paper score" Icon={Award} />
        <StatCard label="Study streak" value={`${studyStreak} day${studyStreak === 1 ? '' : 's'}`} note={`${revisionCount} topics marked for revision`} Icon={Sparkles} />
      </section>
      <section className="chapter-status-strip" aria-label="Chapter completion status">
        <div><strong>{chapters.length}</strong><span>Total chapters</span></div>
        <div><strong>{chapters.filter((chapter) => chapter.topics.every((topic) => progress[topic.id]?.theory)).length}</strong><span>All available theory done</span></div>
        <div><strong>{chapters.filter((chapter) => chapter.topics.some((topic) => progress[topic.id]?.theory) && !chapter.topics.every((topic) => progress[topic.id]?.theory)).length}</strong><span>In progress</span></div>
        <div><strong>{chapters.filter((chapter) => chapter.topics.every((topic) => !progress[topic.id]?.theory)).length}</strong><span>Not started</span></div>
      </section>
      <div className="section-title-row"><div><div className="eyebrow">COURSE MAP</div><h2>Seven chapters</h2></div><span className="priority-disclaimer">Priority reflects syllabus focus, not measured past-paper frequency.</span></div>
      <section className="chapter-grid">{chapters.map((chapter) => <ChapterCard key={chapter.id} chapter={chapter} progress={progress} onNavigate={onNavigate} />)}</section>
      <section className="callout-row"><div className="callout-icon"><FileQuestion size={20} /></div><div><strong>{examPapers.length} supplied exam-paper sets are indexed</strong><p>Question summaries link back to the supplied paper pages. Unmatched solutions and missing marking schemes are flagged; no frequency-based exam priorities are inferred.</p></div><button className="text-link" onClick={() => onNavigate('exams')}>Open question bank <ChevronRight size={15} /></button></section>
    </div>
  );
}

function BookOpenIcon({ size = 18 }) {
  return <span className="book-open-glyph" style={{ width: size, height: size }} aria-hidden="true">▤</span>;
}

export function SyllabusPage({ progress, onOpenTopic }) {
  return (
    <div className="page-stack">
      <header className="page-heading"><div><div className="eyebrow">COURSE HANDOUT 2026</div><h1>Complete syllabus</h1><p>Lecture sequence preserved; topics are grouped into the seven requested chapters. Each item reports its source and teaching status.</p></div></header>
      {chapters.map((chapter) => (
        <section className="syllabus-chapter" key={chapter.id}>
          <div className="syllabus-chapter-heading"><span className="chapter-number">CHAPTER {chapter.number}</span><h2>{chapter.title}</h2><span className="chapter-lectures">Lectures {chapter.handoutLectures}</span></div>
          <p>{chapter.outcome}</p>
          <div className="syllabus-topic-list">{chapter.topics.map((topic) => {
            const evidence = getTopicEvidence(topic);
            return <button className="syllabus-topic" key={topic.id} onClick={() => onOpenTopic(topic.id)}>
              <span className={`status-dot ${lessonLibrary[topic.id] ? 'status-ready' : ''}`} aria-hidden="true" />
              <span className="syllabus-topic-title">{topic.title}<small>{topic.subtopics.length} mapped subtopics · Lectures {topic.lectures}</small></span>
              <span className={`source-status ${evidence.sourceStatus}`}>{evidence.sourceStatus === 'slides-available' ? 'Slides available' : 'Handout outline'}</span>
              <span className="syllabus-progress">{progress[topic.id]?.theory ? 'Studied' : lessonLibrary[topic.id] ? 'Lesson ready' : 'Lesson pending'}</span>
              <ChevronRight size={16} />
            </button>;
          })}</div>
        </section>
      ))}
    </div>
  );
}

export function ChapterPage({ chapter, progress, onOpenTopic, onNavigate }) {
  if (!chapter) return null;
  const rows = chapter.topics.map((topic) => progress[topic.id] || {});
  const theory = rows.filter((item) => item.theory).length;
  const practice = rows.filter((item) => item.practice).length;
  const readiness = rows.filter((item) => item.readiness).length;
  return (
    <div className="page-stack">
      <header className="page-heading chapter-heading">
        <div><div className="eyebrow">CHAPTER {String(chapter.number).padStart(2, '0')} · LECTURES {chapter.handoutLectures}</div><h1>{chapter.title}</h1><p>{chapter.outcome}</p></div>
        <span className={`priority priority-${priorityClass(chapter.priority)}`}><Target size={13} />{chapter.priority} syllabus focus</span>
      </header>
      <div className="chapter-progress-grid">
        <ProgressBar value={pct(theory, chapter.topics.length)} label={`Theory · ${theory}/${chapter.topics.length}`} />
        <ProgressBar value={pct(practice, chapter.topics.length)} label={`Practice · ${practice}/${chapter.topics.length}`} />
        <ProgressBar value={pct(readiness, chapter.topics.length)} label={`Exam readiness · ${readiness}/${chapter.topics.length}`} />
      </div>
      <div className="callout-row compact-callout"><div className="callout-icon"><Clock3 size={19} /></div><div><strong>Estimated study time: {chapter.estimatedHours} hours</strong><p>Study time is an estimate, not a completion requirement. Readiness remains unverified until chapter tests and actual past papers are available.</p></div></div>
      <section className="topic-list">
        {chapter.topics.map((topic, index) => {
          const evidence = getTopicEvidence(topic);
          const done = progress[topic.id] || {};
          const ready = Boolean(lessonLibrary[topic.id]);
          return <article className="topic-row-card" key={topic.id}>
            <div className="topic-index">{String(index + 1).padStart(2, '0')}</div>
            <div className="topic-row-main"><h3>{topic.title}</h3><span className="chapter-lectures">Lecture {topic.lectures}</span><div className="topic-chip-list">{topic.subtopics.slice(0, 4).map((subtopic) => <span className="small-chip" key={subtopic}>{subtopic}</span>)}{topic.subtopics.length > 4 && <span className="small-chip">+{topic.subtopics.length - 4} more</span>}</div><div className="topic-status-line"><span className={`source-status ${evidence.sourceStatus}`}>{ready ? 'Teaching lesson available' : 'Detailed lesson pending'}</span><span>{done.theory ? 'Theory studied' : 'Theory not completed'}</span><span>{sourceNamesFor(topic).join(' · ') || 'Handout topic'}</span></div></div>
            <button className="button button-secondary topic-open" onClick={() => onOpenTopic(topic.id)}>Open topic <ChevronRight size={15} /></button>
          </article>;
        })}
      </section>
      <div className="bottom-navigation"><button className="text-link" onClick={() => onNavigate('syllabus')}><ArrowLeft size={15} />All chapters</button><button className="button button-primary" onClick={() => onNavigate('tests', chapter.id)}>Take chapter test <ArrowRight size={15} /></button></div>
    </div>
  );
}

export function TopicPage({ topic, progress, onProgress, bookmarked, onBookmark, onNavigate, quizScore, onCopy }) {
  if (!topic) return null;
  const chapter = chapterById(topic.chapterId);
  const evidence = getTopicEvidence(topic);
  const lesson = lessonLibrary[topic.id];
  const state = progress[topic.id] || {};
  const problem = practiceProblems.find((item) => item.targetTopicId === topic.id);
  const readyForPractice = Boolean(problem);
  const canMarkReady = false;
  return (
    <div className="page-stack topic-page">
      <div className="breadcrumbs"><button onClick={() => onNavigate('syllabus')}>Syllabus</button><ChevronRight size={14} /><button onClick={() => onNavigate(chapter.id)}>Chapter {chapter.number}</button><ChevronRight size={14} /><span>{topic.title}</span></div>
      <header className="page-heading topic-heading">
        <div><div className="eyebrow">{chapter.title.toUpperCase()} · LECTURE {topic.lectures}</div><h1>{topic.title}</h1><p>{lesson?.introduction || `This topic is part of the Course Handout 2026 sequence. ${topic.subtopics.length} subtopics are mapped below; detailed teaching content is awaiting source verification.`}</p></div>
        <div className="topic-head-actions"><button className={`button ${state.needsReview ? 'button-bookmarked' : 'button-secondary'}`} onClick={() => onProgress(topic.id, 'needsReview', !state.needsReview)}><Lightbulb size={15} />{state.needsReview ? 'Review flagged' : 'Flag for revision'}</button><button className={`button ${bookmarked ? 'button-bookmarked' : 'button-secondary'}`} onClick={() => onBookmark(topic.id)}><Bookmark size={16} fill={bookmarked ? 'currentColor' : 'none'} />{bookmarked ? 'Bookmarked' : 'Bookmark'}</button></div>
      </header>
      <section className="topic-action-grid" aria-label="Topic study status">
        <div className={`level-card ${state.theory ? 'level-done' : ''}`}><span className="level-number">01</span><div><strong>Theory</strong><small>{lesson ? (state.theory ? 'Marked studied' : 'Read the checked lesson, then mark studied') : 'Locked until detailed teaching content is verified'}</small></div><button className="icon-button" disabled={!lesson} aria-label={state.theory ? 'Mark theory not studied' : 'Mark theory studied'} onClick={() => onProgress(topic.id, 'theory', !state.theory)}>{state.theory ? <CheckCircle2 size={20} /> : <Check size={18} />}</button></div>
        <div className={`level-card ${state.practice ? 'level-done' : ''}`}><span className="level-number">02</span><div><strong>Practice</strong><small>{readyForPractice ? (state.practice ? 'Practice marked complete' : 'Solve the linked practice problem') : 'A verified topic-specific problem is not available yet'}</small></div>{readyForPractice ? <button className="icon-button" onClick={() => onNavigate('numerical', topic.id)} aria-label="Open numerical practice"><ChevronRight size={20} /></button> : <LockKeyhole size={18} className="locked-icon" />}</div>
        <div className={`level-card ${state.readiness ? 'level-done' : ''}`}><span className="level-number">03</span><div><strong>Exam readiness</strong><small>{quizScore >= 80 ? `Generated quiz checkpoint passed (${quizScore}%). Actual past-paper practice is still required.` : 'Requires theory, practice, an 80% chapter test, and actual past-paper questions.'}</small></div><button className="icon-button" disabled={!canMarkReady} aria-label="Mark exam readiness" onClick={() => onProgress(topic.id, 'readiness', !state.readiness)}>{state.readiness ? <CheckCircle2 size={20} /> : <LockKeyhole size={18} />}</button></div>
      </section>
      <section className="subtopic-panel"><div className="section-title-row"><div><div className="eyebrow">LEARNING OBJECTIVES</div><h2>Topics in this lesson</h2></div><span className={`source-status ${evidence.sourceStatus}`}>{evidence.sourceStatus === 'slides-available' ? 'Slide source available' : 'Handout-only source'}</span></div><ul className="objective-list">{topic.subtopics.map((item) => <li key={item}><Check size={15} />{item}</li>)}</ul></section>
      <LessonContent topic={topic} lesson={lesson} evidence={evidence} sourceNames={sourceNamesFor(topic)} />
      {problem && <section className="inline-practice-link"><div><strong>Practice for this topic</strong><p>{problem.title} · {problem.type}</p></div><button className="button button-primary" onClick={() => onNavigate('numerical', topic.id)}>Open problem <ArrowRight size={15} /></button></section>}
      <section className="source-card"><div className="source-card-icon"><FileQuestion size={18} /></div><div><strong>Evidence and provenance</strong><p>{evidence.locator}</p><p>Sources: {sourceNamesFor(topic).join(', ') || 'Course Handout 2026'}. The references are locators, not a claim that the source files are embedded in this site.</p></div></section>
      {lesson && <div className="inline-copy-list"><span>Copy formula:</span>{lesson.formulas.slice(0, 2).map((formula) => <button className="text-link" key={formula} data-copy={formula} onClick={onCopy}>{formula} <Download size={13} /></button>)}</div>}
      <div className="bottom-navigation"><button className="text-link" onClick={() => onNavigate(chapter.id)}><ArrowLeft size={15} />Back to chapter topics</button><button className="text-link" onClick={() => onNavigate('tests', chapter.id)}>Chapter test <ArrowRight size={15} /></button></div>
    </div>
  );
}

export function NumericalPractice({ practiceState, onAttempt, initialTopic }) {
  const [chapterFilter, setChapterFilter] = useState(initialTopic ? topicById(initialTopic)?.chapterId || 'all' : 'all');
  const [typeFilter, setTypeFilter] = useState('all');
  const filtered = practiceProblems.filter((problem) => (chapterFilter === 'all' || problem.chapterId === chapterFilter) && (typeFilter === 'all' || problem.type === typeFilter));
  const types = [...new Set(practiceProblems.map((problem) => problem.type))];
  return (
    <div className="page-stack">
      <header className="page-heading"><div><div className="eyebrow">PRACTICE WORKBENCH</div><h1>Numerical practice</h1><p>Generated and tutorial-derived exercises are labeled separately from actual past-paper questions. Try each problem before revealing the worked steps.</p></div></header>
      <div className="filter-row"><label><Filter size={15} />Chapter<select value={chapterFilter} onChange={(event) => setChapterFilter(event.target.value)}><option value="all">All chapters</option>{chapters.map((chapter) => <option value={chapter.id} key={chapter.id}>Chapter {chapter.number}: {chapter.title}</option>)}</select></label><label>Problem type<select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}><option value="all">All types</option>{types.map((type) => <option key={type}>{type}</option>)}</select></label></div>
      {filtered.map((problem, index) => <PracticeCard key={problem.id} problem={problem} index={index} state={practiceState[problem.id] || {}} onAttempt={onAttempt} />)}
      {!filtered.length && <div className="empty-state">No exercises match those filters yet.</div>}
    </div>
  );
}

function PracticeCard({ problem, index, state, onAttempt }) {
  const attempt = (patch) => onAttempt(problem.id, { ...state, ...patch });
  const enteredNumbers = (state.input || '').match(/-?\d+(?:\.\d+)?/g)?.map(Number) || [];
  const checkAnswer = () => {
    const expected = problem.answerNumbers;
    const correct = enteredNumbers.length === expected.length && expected.every((value, i) => Math.abs(enteredNumbers[i] - value) <= Math.max(0.02, Math.abs(value) * 0.01));
    attempt({ checked: true, correct, complete: correct || state.complete });
  };
  return (
    <article className="practice-card">
      <div className="practice-card-heading"><span className="chapter-number">PROBLEM {String(index + 1).padStart(2, '0')}</span><span className="small-chip">{problem.type}</span><span className="generated-label">{problem.practiceKind || 'Generated practice'}</span></div>
      <h2>{problem.title}</h2><p>{problem.prompt}</p>
      <div className="answer-input-row"><label htmlFor={`answer-${problem.id}`}>Your answer <small>Enter the requested numbers in order; units optional.</small></label><input id={`answer-${problem.id}`} type="text" inputMode="decimal" value={state.input || ''} onChange={(event) => attempt({ input: event.target.value, checked: false })} placeholder="Try it before opening the solution" /><button className="button button-primary" onClick={checkAnswer}>Check answer</button></div>
      {state.checked && <div className={`answer-feedback ${state.correct ? 'correct' : 'incorrect'}`} role="status">{state.correct ? 'Correct — well done.' : 'Not quite. Recheck the method or open a hint.'}</div>}
      <div className="practice-actions"><button className="button button-secondary" onClick={() => attempt({ hintShown: !state.hintShown })}><Lightbulb size={15} />{state.hintShown ? 'Hide hint' : 'Show hint'}</button><button className="button button-secondary" onClick={() => attempt({ revealedSteps: state.revealedSteps >= problem.solution.length ? 0 : (state.revealedSteps || 0) + 1 })}>{state.revealedSteps >= problem.solution.length ? 'Restart solution' : 'Reveal next step'}</button><button className="text-link" onClick={() => attempt({ revealedSteps: problem.solution.length })}>Show full solution</button></div>
      {state.hintShown && <div className="hint-box"><Lightbulb size={15} /><span>{problem.hint}</span></div>}
      {state.revealedSteps > 0 && <ol className="revealed-solution">{problem.solution.slice(0, state.revealedSteps).map((step, i) => <li key={step}><span>{i + 1}</span>{step}</li>)}</ol>}
      {state.revealedSteps >= problem.solution.length && <div className="answer-box"><CheckCircle2 size={17} /><span><strong>Final answer:</strong> {problem.answer}</span></div>}
      {state.revealedSteps >= problem.solution.length && <button className={`button ${state.complete ? 'button-bookmarked' : 'button-secondary'}`} onClick={() => attempt({ complete: !state.complete })}>{state.complete ? <CheckCircle2 size={16} /> : <Check size={16} />}{state.complete ? 'Practice completed' : 'Mark practice complete'}</button>}
      <p className="source-label">{problem.sourceLabel}</p>
    </article>
  );
}

export function AssemblyLab({ onNavigate }) {
  const [selected, setSelected] = useState('sum');
  const examples = {
    sum: { title: 'Sum a four-element integer array', architecture: 'MIPS32-style, register conventions shown here are instructional; delay-slot behavior is not simulated.', code: `# $t0 = sum, $t1 = pointer, $t2 = count, $t3 = current value\n        addu  $t0, $zero, $zero\n        la    $t1, ARRAY\n        addiu $t2, $zero, 4\nLOOP:   lw    $t3, 0($t1)\n        addu  $t0, $t0, $t3\n        addiu $t1, $t1, 4\n        addiu $t2, $t2, -1\n        bne   $t2, $zero, LOOP\n        nop\n        sw    $t0, TOTAL`, registers: [['$t0', '0', '10 (sum)'], ['$t1', 'ARRAY', 'ARRAY+16'], ['$t2', '4', '0'], ['$t3', '—', '4 (last element)']], memory: [['ARRAY', '1', '1'], ['ARRAY+4', '2', '2'], ['ARRAY+8', '3', '3'], ['ARRAY+12', '4', '4'], ['TOTAL', 'unchanged', '10']] },
    branch: { title: 'Conditional maximum of two values', architecture: 'MIPS32-style instructional example; assumes $t0 and $t1 contain signed integers.', code: `# If $t0 > $t1, keep $t0; otherwise copy $t1\n        slt   $t2, $t1, $t0\n        beq   $t2, $zero, USE_B\n        nop\n        addu  $t3, $t0, $zero\n        j     DONE\n        nop\nUSE_B:  addu  $t3, $t1, $zero\nDONE:   # $t3 contains the maximum`, registers: [['$t0', '7', '7'], ['$t1', '11', '11'], ['$t2', '—', '0'], ['$t3', '—', '11']], memory: [['No memory writes', '—', '—']] },
    arithmetic: { title: 'Evaluate a simple arithmetic expression', architecture: 'MIPS32-style; compute result = (a + b) − c.', code: `# Input: $s0=a, $s1=b, $s2=c; output: $s3\n        addu  $t0, $s0, $s1\n        subu  $s3, $t0, $s2`, registers: [['$s0 (a)', '8', '8'], ['$s1 (b)', '5', '5'], ['$s2 (c)', '4', '4'], ['$s3 (result)', '—', '9']], memory: [['No memory access', '—', '—']] },
  };
  const example = examples[selected];
  return (
    <div className="page-stack">
      <header className="page-heading"><div><div className="eyebrow">INSTRUCTIONAL SIMULATIONS · NOT AN EMULATOR</div><h1>Assembly language lab</h1><p>Trace registers, memory, and control flow by hand. Examples use MIPS32-style syntax as used in the supplied lecture slides.</p></div></header>
      <div className="filter-row"><label>Example<select value={selected} onChange={(event) => setSelected(event.target.value)}><option value="sum">Array sum loop</option><option value="branch">Conditional maximum</option><option value="arithmetic">Arithmetic expression</option></select></label><button className="button button-secondary" onClick={() => onNavigate('syllabus')}>View addressing-mode syllabus <ArrowRight size={15} /></button></div>
      <article className="assembly-card"><div className="section-title-row"><div><span className="chapter-number">CHAPTER 2</span><h2>{example.title}</h2></div><span className="small-chip">MIPS32-style</span></div><p>{example.architecture}</p><pre className="code-block"><code>{example.code}</code></pre>
        <h3>Register trace</h3><TraceTable headers={['Register', 'Before', 'After']} rows={example.registers} />
        <h3>Memory trace</h3><TraceTable headers={['Address', 'Before', 'After']} rows={example.memory} />
        <div className="note-box"><strong>How to trace:</strong> Start at the first instruction. Record source operands before each operation, update only the destination, and follow the branch condition before deciding the next PC. For real MIPS32, confirm the course’s exact pseudo-instruction and delay-slot conventions.</div>
      </article>
      <section className="source-card"><div className="source-card-icon"><CircleHelp size={18} /></div><div><strong>Instruction reference status</strong><p>The lecture materials identify MIPS32 formats and datapath, but a complete instruction-reference table and an executable simulator have not been supplied or implemented. The examples above are hand-trace exercises, not executed code.</p></div></section>
    </div>
  );
}

function TraceTable({ headers, rows }) {
  return <div className="table-scroll"><table><thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{rows.map((row) => <tr key={row[0]}>{row.map((cell, index) => index === 0 ? <th scope="row" key={cell}>{cell}</th> : <td key={`${row[0]}-${index}`}>{cell}</td>)}</tr>)}</tbody></table></div>;
}

export function ExamBank() {
  const [sessionFilter, setSessionFilter] = useState('all');
  const [chapterFilter, setChapterFilter] = useState('all');
  const questionCount = examPapers.reduce((count, paper) => count + paper.questions.length, 0);
  const linkedSolutionCount = examPapers.filter((paper) => paper.solutionSourceId).length;
  const visiblePapers = examPapers.filter((paper) => {
    const matchesSession = sessionFilter === 'all' || paper.id === sessionFilter;
    const allowedTopics = chapterFilter === 'all'
      ? null
      : allTopics.filter((topic) => topic.chapterId === chapterFilter).map((topic) => topic.id);
    const matchesChapter = !allowedTopics || paper.questions.some((question) => question.topicIds.some((id) => allowedTopics.includes(id)));
    return matchesSession && matchesChapter;
  });

  return (
    <div className="page-stack">
      <header className="page-heading"><div><div className="eyebrow">SOURCE-TRACEABLE QUESTION INDEX</div><h1>Previous-year question bank</h1><p>{examPapers.length} distinct paper sets and {questionCount} question entries are indexed. Prompt descriptions are concise paraphrases; consult the cited source for exact wording, diagrams, and tables.</p></div></header>
      <section className="stats-grid">
        <StatCard label="Distinct paper sets" value={examPapers.length} note="Duplicates excluded" Icon={FileQuestion} />
        <StatCard label="Question entries" value={questionCount} note="With marks and page/paragraph locators" Icon={ClipboardCheck} />
        <StatCard label="Sets with solutions" value={linkedSolutionCount} note="Availability is not the same as a complete official rubric" Icon={CheckCircle2} />
      </section>
      <div className="filter-row">
        <label>Exam session<select value={sessionFilter} onChange={(event) => setSessionFilter(event.target.value)}><option value="all">All supplied sessions</option>{examPapers.map((paper) => <option value={paper.id} key={paper.id}>{paper.session}</option>)}</select></label>
        <label>Chapter<select value={chapterFilter} onChange={(event) => setChapterFilter(event.target.value)}><option value="all">All chapters</option>{chapters.map((chapter) => <option value={chapter.id} key={chapter.id}>Chapter {chapter.number}: {chapter.title}</option>)}</select></label>
      </div>
      {visiblePapers.map((paper) => {
        const paperSource = sources.find((source) => source.id === paper.paperSourceId);
        const solutionSource = paper.solutionSourceId ? sources.find((source) => source.id === paper.solutionSourceId) : null;
        const allowedTopics = chapterFilter === 'all'
          ? null
          : allTopics.filter((topic) => topic.chapterId === chapterFilter).map((topic) => topic.id);
        const visibleQuestions = paper.questions.filter((question) => !allowedTopics || question.topicIds.some((id) => allowedTopics.includes(id)));
        return <details className="syllabus-chapter exam-paper-details" key={paper.id} open={sessionFilter !== 'all'}>
          <summary className="section-title-row exam-paper-summary"><div><div className="eyebrow">{paper.totalMarks} MARKS · {paper.questions.length} QUESTIONS</div><h2>{paper.session}</h2></div><span className={`source-status ${paper.markingScheme === 'included' ? 'slides-available' : 'handout-only'}`}>{paper.markingScheme} marking scheme</span></summary>
          <p className="source-label">Question source: {paperSource?.filename} · Solution: {solutionSource ? `${solutionSource.filename} (${paper.solutionLocator})` : 'No matched solution supplied'}.</p>
          {paper.note && <p className="source-label">{paper.note}</p>}
          <div className="exam-question-list">{visibleQuestions.map((question) => <article className="quiz-card exam-question-card" key={`${paper.id}-${question.number}`}>
            <div className="practice-card-heading"><span className="chapter-number">{question.number}</span><span className="small-chip">{question.marks} marks · {question.locator}</span></div>
            <h2>{question.summary}</h2>
            <p className="source-label">Topic: {question.topicIds.map((id) => topicById(id)?.title || id).join(' · ')} · Source: {paperSource?.filename}, {question.locator}.</p>
          </article>)}</div>
        </details>;
      })}
      {!visiblePapers.length && <div className="empty-state">No supplied questions match those filters.</div>}
      <section className="syllabus-chapter"><h2>Supplied tutorials and assignments</h2><p>These are course exercises, not past examination questions. Selected tutorial problems with checked workings are also available under Numerical practice.</p><div className="source-registry">{tutorialSets.map((set) => {
        const source = sources.find((item) => item.id === set.sourceId);
        return <div className="source-registry-row" key={set.id}><span className="status-dot status-ready" /><div><strong>{set.title}</strong><small>{set.coverage} Source: {source?.filename}, {set.locator}.</small></div><span className="source-status slides-available">Supplied</span></div>;
      })}</div></section>
      <section className="missing-paper-panel"><div className="pending-icon"><Clock3 size={20} /></div><div><h2>Source reconciliation and remaining gaps</h2><p>{unavailableSources.join('; ')}.</p>{unmatchedExamSources.map((item) => <p className="source-label" key={item.sourceId}>{sources.find((source) => source.id === item.sourceId)?.filename}: {item.note}</p>)}</div></section>
    </div>
  );
}

export function ChapterTests({ quizScores, onSaveScore, initialChapter }) {
  const [chapterId, setChapterId] = useState(initialChapter || chapters[0].id);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const questions = quizBank.filter((question) => question.chapterId === chapterId);
  const chapter = chapterById(chapterId);
  const score = questions.length ? Math.round(questions.filter((question) => answers[question.id] === question.answer).length / questions.length * 100) : 0;
  const submit = () => { setSubmitted(true); onSaveScore(chapterId, score); };
  return (
    <div className="page-stack">
      <header className="page-heading"><div><div className="eyebrow">FORMATIVE CHECK</div><h1>Chapter tests</h1><p>These are short generated checks for feedback—not questions from past examinations. A score of 80% is a self-study checkpoint, not a guarantee of exam readiness.</p></div></header>
      <div className="filter-row"><label>Chapter<select value={chapterId} onChange={(event) => { setChapterId(event.target.value); setSubmitted(false); setAnswers({}); }} aria-label="Select test chapter">{chapters.map((item) => <option value={item.id} key={item.id}>Chapter {item.number}: {item.title}</option>)}</select></label>{quizScores[chapterId] && <span className="muted-text">Best attempt: {quizScores[chapterId].best}%</span>}</div>
      <section className="test-intro"><ClipboardCheck size={20} /><div><strong>Chapter {chapter?.number}: {chapter?.title}</strong><p>{questions.length} question{questions.length === 1 ? '' : 's'} · Choose an answer, submit, then review explanations.</p></div></section>
      {questions.map((question, index) => <article className="quiz-card" key={question.id}><span className="chapter-number">QUESTION {index + 1}</span><h2>{question.prompt}</h2><div className="quiz-options">{question.options.map((option, optionIndex) => <label className={submitted && optionIndex === question.answer ? 'correct-option' : ''} key={option}><input type="radio" name={question.id} checked={answers[question.id] === optionIndex} onChange={() => { setAnswers({ ...answers, [question.id]: optionIndex }); setSubmitted(false); }} />{option}</label>)}</div>{submitted && <p className={`quiz-explanation ${answers[question.id] === question.answer ? 'correct-text' : 'incorrect-text'}`}><strong>{answers[question.id] === question.answer ? 'Correct.' : 'Review:'}</strong> {question.explanation}</p>}</article>)}
      {!submitted ? <button className="button button-primary" onClick={submit} disabled={questions.some((question) => answers[question.id] === undefined)}>Submit test</button> : <div className={`test-result ${score >= 80 ? 'pass' : 'retry'}`} role="status"><Award size={20} /><div><strong>Score: {score}%</strong><p>{score >= 80 ? 'Checkpoint met. Past-paper questions are indexed separately; this generated quiz score does not measure that practice.' : 'Review the explanations, then try again.'}</p></div><button className="button button-secondary" onClick={() => { setSubmitted(false); setAnswers({}); }}>Retake test</button></div>}
      <p className="source-label">Question provenance: generated study check, not an actual examination question.</p>
    </div>
  );
}

export function RevisionCentre({ progress, onNavigate }) {
  const total = allTopics.length;
  const theory = allTopics.filter((topic) => progress[topic.id]?.theory).length;
  return (
    <div className="page-stack">
      <header className="page-heading"><div><div className="eyebrow">RECALL AND CONSOLIDATION</div><h1>Revision centre</h1><p>Use the checklist to locate gaps. Questions and practice here are generated unless explicitly sourced to an uploaded paper.</p></div></header>
      <section className="revision-banner"><div><span className="eyebrow">THEORY COVERAGE</span><strong>{theory} / {total} topics</strong><p>Progress counts only lessons with verified teaching content.</p></div><ProgressBar value={pct(theory, total)} /></section>
      <div className="revision-grid">{chapters.map((chapter) => {
        const notStudied = chapter.topics.filter((topic) => !progress[topic.id]?.theory);
        const studied = chapter.topics.length - notStudied.length;
        return <article className="revision-card" key={chapter.id}><div className="chapter-number">CHAPTER {chapter.number}</div><h3>{chapter.title}</h3><ProgressBar value={pct(studied, chapter.topics.length)} label={`${studied}/${chapter.topics.length} theory topics`} compact /><h4>Next topics to study</h4>{notStudied.slice(0, 3).map((topic) => <button className="text-link" key={topic.id} onClick={() => onNavigate(`topic/${topic.id}`)}>{topic.title}<ChevronRight size={13} /></button>)}{notStudied.length === 0 && <p>All available lessons are marked studied.</p>}</article>;
      })}</div>
      <section className="callout-row"><div className="callout-icon"><Lightbulb size={19} /></div><div><strong>Quick revision routine</strong><p>Recall definitions without notes, solve one formula-based problem, trace one assembly sequence, and explain one comparison. Use the source-status labels to identify topics that still need slide or exam verification.</p></div></section>
    </div>
  );
}

export function BookmarksPage({ bookmarks, formulaBookmarks, onBookmarkTopic, onBookmarkFormula, onNavigate }) {
  const topicItems = bookmarks.map(topicById).filter(Boolean);
  const formulaItems = formulaBook.filter((item) => formulaBookmarks.includes(item.name));
  return (
    <div className="page-stack">
      <header className="page-heading"><div><div className="eyebrow">SAVED FOR LATER</div><h1>Bookmarks</h1><p>Saved topics and formulas persist in this browser.</p></div></header>
      <section className="bookmark-section"><h2>Topics <span className="small-chip">{topicItems.length}</span></h2>{topicItems.length ? topicItems.map((topic) => <div className="bookmark-row" key={topic.id}><button className="text-link" onClick={() => onNavigate(`topic/${topic.id}`)}>{topic.title}<ChevronRight size={14} /></button><button className="icon-button" onClick={() => onBookmarkTopic(topic.id)} aria-label={`Remove ${topic.title} bookmark`}><Bookmark size={16} fill="currentColor" /></button></div>) : <div className="empty-state">Bookmark a topic from its lesson page to save it here.</div>}</section>
      <section className="bookmark-section"><h2>Formulas <span className="small-chip">{formulaItems.length}</span></h2>{formulaItems.length ? formulaItems.map((item) => <div className="bookmark-row" key={item.name}><div><strong>{item.name}</strong><code>{item.formula}</code></div><button className="icon-button" onClick={() => onBookmarkFormula(item.name)} aria-label={`Remove ${item.name} bookmark`}><Bookmark size={16} fill="currentColor" /></button></div>) : <div className="empty-state">Bookmark a formula in the Formula Book to save it here.</div>}</section>
    </div>
  );
}

export function ProgressReport({ progress, practiceState, quizScores, studyStreak, onNavigate }) {
  const counts = {
    theory: allTopics.filter((topic) => progress[topic.id]?.theory).length,
    practice: allTopics.filter((topic) => progress[topic.id]?.practice).length,
    readiness: allTopics.filter((topic) => progress[topic.id]?.readiness).length,
  };
  const passed = chapters.filter((chapter) => (quizScores[chapter.id]?.best || 0) >= 80).length;
  const numerical = practiceProblems.filter((problem) => practiceState[problem.id]?.complete).length;
  return (
    <div className="page-stack">
      <header className="page-heading"><div><div className="eyebrow">YOUR LEARNING RECORD</div><h1>Progress report</h1><p>Theory, practice, and examination readiness are tracked independently. No level is awarded automatically from another.</p></div><button className="button button-secondary" onClick={() => onNavigate('settings')}><Download size={15} />Export / settings</button></header>
      <section className="report-level-grid">{[
        ['LEVEL 1', 'Theory', counts.theory, allTopics.length, 'Only lessons with authored content can be marked studied.'],
        ['LEVEL 2', 'Practice', counts.practice, allTopics.length, `${numerical} of ${practiceProblems.length} numerical exercises marked complete.`],
        ['LEVEL 3', 'Exam readiness', counts.readiness, allTopics.length, `${passed} chapter quiz checkpoints passed; actual past-paper work is still unavailable.`],
      ].map(([label, title, done, total, note]) => <article className="report-level-card" key={title}><span className="chapter-number">{label}</span><h2>{title}</h2><strong className="report-number">{done}<small> / {total}</small></strong><ProgressBar value={pct(done, total)} /><p>{note}</p></article>)}</section>
      <section className="stats-grid"><StatCard label="Study streak" value={`${studyStreak} days`} note="Based on days opened in this browser" Icon={Sparkles} /><StatCard label="Numericals completed" value={numerical} note="Self-check or correct answer recorded" Icon={CheckCircle2} /><StatCard label="Chapter tests passed" value={`${passed}/7`} note="At least 80% on generated checks" Icon={Award} /><StatCard label="Topics needing revision" value={allTopics.filter((topic) => progress[topic.id]?.needsReview).length} note="Marked manually from lesson page" Icon={Target} /></section>
      <p className="coverage-caveat">Progress is stored locally in this browser. It is not a verified exam score or a prediction of final grades.</p>
    </div>
  );
}

export function SettingsPage({ theme, setTheme, fontScale, setFontScale, customSources, addCustomSources, removeCustomSource, onExport, onExportManifest }) {
  return (
    <div className="page-stack">
      <header className="page-heading"><div><div className="eyebrow">PREFERENCES AND CONTENT SOURCES</div><h1>Settings</h1><p>Personal settings and progress are stored locally in this browser. Source files registered here are not uploaded or parsed.</p></div></header>
      <section className="settings-card"><h2>Appearance</h2><div className="setting-row"><div><strong>Color theme</strong><p>Choose the light or dark study surface.</p></div><div className="segmented-control"><button className={theme === 'light' ? 'active' : ''} onClick={() => setTheme('light')}>Light</button><button className={theme === 'dark' ? 'active' : ''} onClick={() => setTheme('dark')}>Dark</button></div></div><div className="setting-row"><div><strong>Reading size</strong><p>Adjust text size for lesson content.</p></div><div className="segmented-control"><button className={fontScale === 'comfortable' ? 'active' : ''} onClick={() => setFontScale('comfortable')}>Standard</button><button className={fontScale === 'large' ? 'active' : ''} onClick={() => setFontScale('large')}>Large</button></div></div></section>
      <section className="settings-card"><h2>Source registry</h2><p>Available source materials are tracked below. Adding a file registers its filename and metadata on this device only; the browser does not extract slide text or upload the document.</p><label className="upload-button button button-secondary">Register source files<input type="file" multiple accept=".pdf,.ppt,.pptx,.doc,.docx,.txt,.csv" onChange={(event) => { addCustomSources(Array.from(event.target.files || [])); event.target.value = ''; }} /></label><div className="source-registry">{sources.map((source) => <div className="source-registry-row" key={source.id}><span className="status-dot status-ready" /><div><strong>{source.filename}</strong><small>{source.detail}</small></div><span className="source-status slides-available">Available</span></div>)}{customSources.map((source) => <div className="source-registry-row" key={source.id}><span className="status-dot" /><div><strong>{source.name}</strong><small>{source.size} bytes · Registered locally · Extraction and verification pending</small></div><span className="source-status handout-only">Awaiting review</span><button className="icon-button" onClick={() => removeCustomSource(source.id)} aria-label={`Remove ${source.name}`}>×</button></div>)}</div><p className="source-label">Missing papers and source types: {unavailableSources.join('; ')}.</p></section>
      <section className="settings-card"><h2>Progress data</h2><p>Export your locally stored progress as a JSON file for backup. This does not contain uploaded source content.</p><button className="button button-primary" onClick={onExport}><Download size={15} />Download progress backup</button></section>
      <section className="settings-card"><h2>Content manifest</h2><p>Export the chapter/topic/subtopic source map, evidence locators, and teaching/practice statuses as JSON or CSV.</p><div className="manifest-export-actions"><button className="button button-secondary" onClick={() => onExportManifest('json')}>Download JSON manifest</button><button className="button button-secondary" onClick={() => onExportManifest('csv')}>Download CSV manifest</button></div></section>
      <a className="text-link" href="./legacy.html">Open the existing eleven-section study guide <ArrowRight size={15} /></a>
    </div>
  );
}
