import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowRight, BookOpen, Check, ChevronRight, Menu, Moon, Search, Sigma,
  Sun, X,
} from 'lucide-react';
import Sidebar from './components/Sidebar.jsx';
import ProgressBar from './components/ProgressBar.jsx';
import {
  AssemblyLab, BookmarksPage, ChapterPage, ChapterTests, Dashboard,
  ExamBank, NumericalPractice, ProgressReport, RevisionCentre,
  SettingsPage, SyllabusPage, TopicPage,
} from './components/StudyPages.jsx';
import { chapters, allTopics } from './data/syllabus.js';
import { formulaBook, lessonLibrary } from './data/lessons.js';
import { contentManifest } from './data/sourceManifest.js';

const FormulaPage = lazy(() => import('./components/FormulaPage.jsx'));

const STORAGE_KEY = 'coa-atlas-state-v1';

function defaultState() {
  return {
    progress: {},
    practiceState: {},
    quizScores: {},
    bookmarkedTopics: [],
    bookmarkedFormulas: [],
    customSources: [],
    theme: 'light',
    fontScale: 'comfortable',
    studyStreak: { lastVisit: '', count: 0 },
  };
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return defaultState();
  try {
    const parsed = JSON.parse(saved);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new TypeError('Saved study state must be a JSON object.');
    }
    return { ...defaultState(), ...parsed };
  } catch (error) {
    console.error('Could not read saved COA Atlas progress.', error);
    return defaultState();
  }
}

function currentHash() {
  return window.location.hash.replace(/^#/, '') || 'dashboard';
}

function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function dayDifference(a, b) {
  const [ay, am, ad] = a.split('-').map(Number);
  const [by, bm, bd] = b.split('-').map(Number);
  return Math.round((Date.UTC(by, bm - 1, bd) - Date.UTC(ay, am - 1, ad)) / 86400000);
}

function getTopic(topicId) {
  return allTopics.find((topic) => topic.id === topicId);
}

export default function App() {
  const [appState, setAppState] = useState(loadState);
  const [route, setRoute] = useState(currentHash);
  const [searchText, setSearchText] = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [storageError, setStorageError] = useState(false);
  const [testInitialChapter, setTestInitialChapter] = useState('');
  const [practiceInitialTopic, setPracticeInitialTopic] = useState('');

  useEffect(() => {
    const onHashChange = () => setRoute(currentHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
      setStorageError(false);
    } catch (error) {
      console.error('Could not save COA Atlas progress in this browser.', error);
      setStorageError(true);
    }
  }, [appState]);

  useEffect(() => {
    document.documentElement.dataset.theme = appState.theme === 'dark' ? 'dark' : 'light';
    document.documentElement.dataset.fontSize = appState.fontScale === 'large' ? 'large' : 'comfortable';
  }, [appState.theme, appState.fontScale]);

  useEffect(() => {
    const today = localDateKey();
    setAppState((previous) => {
      const last = previous.studyStreak?.lastVisit || '';
      if (last === today) return previous;
      const count = last && dayDifference(last, today) === 1 ? previous.studyStreak.count + 1 : 1;
      return { ...previous, studyStreak: { lastVisit: today, count } };
    });
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const navigate = useCallback((target, context = '') => {
    if (target === 'tests' && context) setTestInitialChapter(context);
    if (target === 'numerical' && context) setPracticeInitialTopic(context);
    if (target !== 'tests') setTestInitialChapter('');
    if (target !== 'numerical') setPracticeInitialTopic('');
    const hash = `#${target}`;
    if (window.location.hash === hash) setRoute(target);
    else window.location.hash = target;
    setSearchOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const updateProgress = useCallback((topicId, key, value) => {
    setAppState((previous) => ({
      ...previous,
      progress: {
        ...previous.progress,
        [topicId]: { ...(previous.progress[topicId] || {}), [key]: value },
      },
    }));
  }, []);

  const toggleTopicBookmark = useCallback((topicId) => {
    setAppState((previous) => {
      const current = previous.bookmarkedTopics || [];
      const exists = current.includes(topicId);
      return { ...previous, bookmarkedTopics: exists ? current.filter((id) => id !== topicId) : [...current, topicId] };
    });
  }, []);

  const toggleFormulaBookmark = useCallback((formulaName) => {
    setAppState((previous) => {
      const current = previous.bookmarkedFormulas || [];
      const exists = current.includes(formulaName);
      return { ...previous, bookmarkedFormulas: exists ? current.filter((name) => name !== formulaName) : [...current, formulaName] };
    });
  }, []);

  const updatePractice = useCallback((problemId, update) => {
    setAppState((previous) => {
      const nextPractice = { ...previous.practiceState, [problemId]: update };
      const problemTopic = {
        'perf-cpi': 'performance',
        'cache-fields': 'cache-performance',
        'dma-time': 'dma',
        'disk-delay': 'secondary-storage',
        'pipeline-cpi': 'pipeline-basics',
        amdahl: 'performance',
      }[problemId];
      const nextProgress = problemTopic
        ? { ...previous.progress, [problemTopic]: { ...(previous.progress[problemTopic] || {}), practice: Boolean(update.complete) } }
        : previous.progress;
      return { ...previous, practiceState: nextPractice, progress: nextProgress };
    });
  }, []);

  const saveQuizScore = useCallback((chapterId, score) => {
    setAppState((previous) => {
      const current = previous.quizScores[chapterId] || { attempts: 0, best: 0, latest: 0 };
      return {
        ...previous,
        quizScores: {
          ...previous.quizScores,
          [chapterId]: { attempts: current.attempts + 1, best: Math.max(current.best, score), latest: score },
        },
      };
    });
  }, []);

  const addCustomSources = useCallback((files) => {
    const additions = files.map((file) => ({
      id: `${file.name}-${file.lastModified}-${file.size}`,
      name: file.name,
      size: file.size,
      type: file.type || 'Unknown file type',
      lastModified: file.lastModified,
    }));
    setAppState((previous) => {
      const seen = new Set(previous.customSources.map((source) => source.id));
      return { ...previous, customSources: [...previous.customSources, ...additions.filter((source) => !seen.has(source.id))] };
    });
    if (files.length) setToast(`${files.length} source file${files.length === 1 ? '' : 's'} registered on this device.`);
  }, []);

  const removeCustomSource = useCallback((sourceId) => {
    setAppState((previous) => ({ ...previous, customSources: previous.customSources.filter((source) => source.id !== sourceId) }));
  }, []);

  const exportProgress = useCallback(() => {
    const blob = new Blob([JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), ...appState }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'coa-atlas-progress.json';
    link.click();
    URL.revokeObjectURL(url);
    setToast('Progress backup downloaded.');
  }, [appState]);

  const exportManifest = useCallback((format) => {
    const fields = Object.keys(contentManifest[0] || {});
    const escapeCsv = (value) => `"${String(Array.isArray(value) ? value.join('; ') : value ?? '').replace(/"/g, '""')}"`;
    const contents = format === 'csv'
      ? [fields.map(escapeCsv).join(','), ...contentManifest.map((row) => fields.map((field) => escapeCsv(row[field])).join(','))].join('\r\n')
      : JSON.stringify(contentManifest, null, 2);
    const blob = new Blob([contents], { type: format === 'csv' ? 'text/csv' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `coa-content-manifest.${format}`;
    link.click();
    URL.revokeObjectURL(url);
    setToast(`Content manifest exported as ${format.toUpperCase()}.`);
  }, []);

  const copyText = useCallback(async (event) => {
    const formula = event.target.closest('[data-copy]')?.dataset.copy;
    if (!formula) return;
    try {
      await navigator.clipboard.writeText(formula);
      setToast('Copied to clipboard.');
    } catch (error) {
      console.error('Could not copy formula to clipboard.', error);
      setToast('Clipboard access is unavailable. Select and copy the formula manually.');
    }
  }, []);

  const searchResults = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return [];
    const topicResults = allTopics.filter((topic) => {
      const lesson = lessonLibrary[topic.id];
      const lessonText = lesson ? `${lesson.introduction} ${lesson.explanation.join(' ')} ${lesson.formulas.join(' ')}` : '';
      return `${topic.title} ${topic.subtopics.join(' ')} ${topic.chapterTitle} ${lessonText}`.toLowerCase().includes(query);
    }).slice(0, 7).map((topic) => ({ id: `topic/${topic.id}`, title: topic.title, subtitle: topic.chapterTitle, type: 'Topic' }));
    const formulaResults = formulaBook.filter((item) =>
      `${item.name} ${item.formula} ${item.variables} ${item.use}`.toLowerCase().includes(query),
    ).slice(0, 3).map((item) => ({ id: 'formulas', title: item.name, subtitle: item.formula, type: 'Formula' }));
    return [...topicResults, ...formulaResults];
  }, [searchText]);

  const theoryDone = allTopics.filter((topic) => appState.progress[topic.id]?.theory).length;
  const activeTopicId = route.startsWith('topic/') ? route.slice('topic/'.length) : '';
  const activeTopic = getTopic(activeTopicId);
  const activeChapterId = route.startsWith('chapter-') ? route : activeTopic?.chapterId || '';
  const activeChapter = chapters.find((chapter) => chapter.id === activeChapterId);
  const activeNav = activeTopic?.chapterId || route;
  const activeLabel = activeTopic?.title || activeChapter?.title || route.replace('-', ' ');
  const progressSummary = { theoryPercent: Math.round(theoryDone / allTopics.length * 100), theoryDone, topicCount: allTopics.length };

  const chooseSearchResult = (result) => {
    if (result.type !== 'Formula') setSearchText('');
    navigate(result.id);
  };

  let page;
  if (route === 'dashboard') {
    page = <Dashboard progress={appState.progress} practiceState={appState.practiceState} quizScores={appState.quizScores} studyStreak={appState.studyStreak.count} onNavigate={navigate} />;
  } else if (route === 'syllabus') {
    page = <SyllabusPage progress={appState.progress} onOpenTopic={(topicId) => navigate(`topic/${topicId}`)} />;
  } else if (activeTopic) {
    const chapterQuizScore = appState.quizScores[activeTopic.chapterId]?.best || 0;
    page = <TopicPage topic={activeTopic} progress={appState.progress} onProgress={updateProgress} bookmarked={(appState.bookmarkedTopics || []).includes(activeTopic.id)} onBookmark={toggleTopicBookmark} onNavigate={navigate} quizScore={chapterQuizScore} onCopy={copyText} />;
  } else if (activeChapter) {
    page = <ChapterPage chapter={activeChapter} progress={appState.progress} onOpenTopic={(topicId) => navigate(`topic/${topicId}`)} onNavigate={navigate} />;
  } else if (route === 'numerical') {
    page = <NumericalPractice practiceState={appState.practiceState} onAttempt={updatePractice} initialTopic={practiceInitialTopic} />;
  } else if (route === 'assembly') {
    page = <AssemblyLab onNavigate={navigate} />;
  } else if (route === 'formulas') {
    page = <Suspense fallback={<div className="empty-state">Loading formula book…</div>}><FormulaPage bookmarkedFormulas={appState.bookmarkedFormulas} onBookmarkFormula={toggleFormulaBookmark} query={searchText} /></Suspense>;
  } else if (route === 'exams') {
    page = <ExamBank />;
  } else if (route === 'tests') {
    page = <ChapterTests key={testInitialChapter || 'default'} quizScores={appState.quizScores} onSaveScore={saveQuizScore} initialChapter={testInitialChapter} />;
  } else if (route === 'revision') {
    page = <RevisionCentre progress={appState.progress} onNavigate={navigate} />;
  } else if (route === 'bookmarks') {
    page = <BookmarksPage bookmarks={appState.bookmarkedTopics || []} formulaBookmarks={appState.bookmarkedFormulas || []} onBookmarkTopic={toggleTopicBookmark} onBookmarkFormula={toggleFormulaBookmark} onNavigate={navigate} />;
  } else if (route === 'report') {
    page = <ProgressReport progress={appState.progress} practiceState={appState.practiceState} quizScores={appState.quizScores} studyStreak={appState.studyStreak.count} onNavigate={navigate} />;
  } else if (route === 'settings') {
    page = <SettingsPage theme={appState.theme} setTheme={(theme) => setAppState((previous) => ({ ...previous, theme }))} fontScale={appState.fontScale} setFontScale={(fontScale) => setAppState((previous) => ({ ...previous, fontScale }))} customSources={appState.customSources} addCustomSources={addCustomSources} removeCustomSource={removeCustomSource} onExport={exportProgress} onExportManifest={exportManifest} />;
  } else {
    page = <Dashboard progress={appState.progress} practiceState={appState.practiceState} quizScores={appState.quizScores} studyStreak={appState.studyStreak.count} onNavigate={navigate} />;
  }

  return (
    <div className="app-shell">
      <Sidebar activePage={activeNav} navigate={navigate} progress={progressSummary} open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <main className="main-content">
        <header className="topbar">
          <button className="mobile-menu-button" onClick={() => setMobileNavOpen(true)} aria-label="Open course navigation"><Menu size={20} /></button>
          <div className="topbar-breadcrumb"><BookOpen size={16} /><span>COA Atlas</span><ChevronRight size={14} /><strong>{activeLabel}</strong></div>
          <div className="topbar-actions">
            <div className="global-search">
              <Search size={16} aria-hidden="true" />
              <input aria-label="Search syllabus, lessons, and formulas" value={searchText} onFocus={() => setSearchOpen(true)} onChange={(event) => { setSearchText(event.target.value); setSearchOpen(true); }} onKeyDown={(event) => { if (event.key === 'Enter' && searchResults[0]) chooseSearchResult(searchResults[0]); if (event.key === 'Escape') setSearchOpen(false); }} placeholder="Search lessons and formulas" />
              {searchText && <button className="search-clear" onClick={() => { setSearchText(''); setSearchOpen(false); }} aria-label="Clear search"><X size={14} /></button>}
              {searchOpen && searchText.trim() && <div className="search-results" role="listbox" aria-label="Search results">
                {searchResults.length ? searchResults.map((result) => <button key={`${result.type}-${result.title}`} onMouseDown={(event) => event.preventDefault()} onClick={() => chooseSearchResult(result)}><span className="search-result-type">{result.type}</span><span><strong>{result.title}</strong><small>{result.subtitle}</small></span><ArrowRight size={14} /></button>) : <div className="search-no-results">No matching topics or formulas.</div>}
              </div>}
            </div>
            <button className="icon-button theme-toggle" onClick={() => setAppState((previous) => ({ ...previous, theme: previous.theme === 'dark' ? 'light' : 'dark' }))} aria-label={`Switch to ${appState.theme === 'dark' ? 'light' : 'dark'} theme`}>{appState.theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}</button>
            <button className="formula-shortcut" onClick={() => navigate('formulas')}><Sigma size={16} /><span>Formula book</span></button>
          </div>
        </header>
        {storageError && <div className="storage-warning" role="alert">Browser storage is unavailable or full. Progress changes may not persist after closing this page.</div>}
        <div className="page-content" onClick={(event) => {
          if (event.target.closest('[data-copy]')) copyText(event);
          else if (searchOpen && !event.target.closest('.global-search')) setSearchOpen(false);
        }}>
          {page}
          <footer className="app-footer"><span>COA Atlas · Course Handout 2026 sequence</span><span>Locally stored progress · Source status shown per topic</span></footer>
        </div>
      </main>
      {toast && <div className="toast-message" role="status">{toast}</div>}
    </div>
  );
}
