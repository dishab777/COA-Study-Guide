import {
  Activity, BookOpen, Bookmark, Calculator, ChevronDown, ClipboardCheck,
  FileQuestion, GraduationCap, Home, Layers3, ListChecks, Settings, Sigma,
} from 'lucide-react';
import { chapters } from '../data/syllabus.js';

const pages = [
  { id: 'dashboard', label: 'Dashboard', Icon: Home },
  { id: 'syllabus', label: 'Complete syllabus', Icon: ListChecks },
];

const tools = [
  { id: 'numerical', label: 'Numerical practice', Icon: Calculator },
  { id: 'assembly', label: 'Assembly lab', Icon: BookOpen },
  { id: 'formulas', label: 'Formula book', Icon: Sigma },
  { id: 'exams', label: 'Past-paper bank', Icon: FileQuestion },
  { id: 'tests', label: 'Chapter tests', Icon: ClipboardCheck },
  { id: 'revision', label: 'Revision centre', Icon: GraduationCap },
  { id: 'bookmarks', label: 'Bookmarks', Icon: Bookmark },
  { id: 'report', label: 'Progress report', Icon: Activity },
];

export default function Sidebar({ activePage, navigate, progress, open, onClose }) {
  const renderLink = ({ id, label, Icon }, extraClass = '') => (
    <a
      className={`side-link ${activePage === id ? 'selected' : ''} ${extraClass}`}
      href={`#${id}`}
      key={id}
      onClick={(event) => {
        event.preventDefault();
        navigate(id);
        onClose();
      }}
      aria-current={activePage === id ? 'page' : undefined}
    >
      <Icon size={17} aria-hidden="true" />
      <span>{label}</span>
    </a>
  );

  return (
    <>
      {open && <button className="mobile-backdrop" onClick={onClose} aria-label="Close navigation" />}
      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`} aria-label="Course navigation">
        <a className="brand" href="#dashboard" onClick={(event) => { event.preventDefault(); navigate('dashboard'); onClose(); }}>
          <span className="brand-mark">C</span>
          <span><strong>COA Atlas</strong><small>Examination study platform</small></span>
        </a>
        <div className="course-meter">
          <div className="meter-heading"><span>Theory progress</span><strong>{progress.theoryPercent}%</strong></div>
          <div className="meter"><i style={{ width: `${progress.theoryPercent}%` }} /></div>
          <small>{progress.theoryDone} of {progress.topicCount} topics studied</small>
        </div>
        <nav className="main-nav" aria-label="Main">
          {pages.map((item) => renderLink(item))}
        </nav>
        <details className="chapter-nav" open>
          <summary>Course chapters <ChevronDown size={15} aria-hidden="true" /></summary>
          <nav aria-label="Chapters">
            {chapters.map((chapter) => renderLink(
              { id: chapter.id, label: chapter.title, Icon: Layers3 },
              'chapter-link',
            ))}
          </nav>
        </details>
        <div className="nav-section-label">Study tools</div>
        <nav className="main-nav" aria-label="Study tools">
          {tools.map((item) => renderLink(item))}
        </nav>
        <div className="sidebar-bottom">
          {renderLink({ id: 'settings', label: 'Settings & sources', Icon: Settings })}
          <a className="side-link legacy-link" href="./legacy.html">
            <BookOpen size={17} aria-hidden="true" /><span>Existing guide notes</span>
          </a>
          <p>Source coverage is shown per topic. Unavailable exams are never presented as past questions.</p>
        </div>
      </aside>
    </>
  );
}
