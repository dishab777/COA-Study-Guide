import { useMemo, useState } from 'react';
import { BlockMath } from 'react-katex';
import { Download, Filter, Search, Bookmark } from 'lucide-react';
import { chapters } from '../data/syllabus.js';
import { formulaBook } from '../data/lessons.js';

const chapterById = (id) => chapters.find((chapter) => chapter.id === id);

export default function FormulaPage({ bookmarkedFormulas, onBookmarkFormula, query = '' }) {
  const [filter, setFilter] = useState('all');
  const filtered = useMemo(() => formulaBook.filter((item) => {
    const matchesChapter = filter === 'all' || item.chapterId === filter;
    const text = `${item.name} ${item.formula} ${item.variables} ${item.use} ${item.example}`.toLowerCase();
    return matchesChapter && text.includes(query.toLowerCase());
  }), [filter, query]);
  return (
    <div className="page-stack">
      <header className="page-heading"><div><div className="eyebrow">REFERENCE LIBRARY</div><h1>Formula book</h1><p>Every formula has its variables, units, conditions, and a short example. Search from the header or print this page.</p></div><button className="button button-secondary" onClick={() => window.print()}><Download size={15} />Print formula book</button></header>
      <div className="filter-row"><label><Filter size={15} />Chapter<select value={filter} onChange={(event) => setFilter(event.target.value)}><option value="all">All chapters</option>{chapters.map((chapter) => <option value={chapter.id} key={chapter.id}>Chapter {chapter.number}</option>)}</select></label><span className="muted-text">{filtered.length} formulas</span></div>
      <div className="formula-grid">{filtered.map((item) => <article className="formula-card" key={item.name}><div className="formula-card-top"><span className="chapter-number">{chapterById(item.chapterId)?.title}</span><button className={`icon-button ${bookmarkedFormulas.includes(item.name) ? 'bookmarked' : ''}`} onClick={() => onBookmarkFormula(item.name)} aria-label={bookmarkedFormulas.includes(item.name) ? 'Remove formula bookmark' : 'Bookmark formula'}><Bookmark size={17} fill={bookmarkedFormulas.includes(item.name) ? 'currentColor' : 'none'} /></button></div><h3>{item.name}</h3><div className="formula-math"><BlockMath math={item.latex} /></div><code className="formula-display">{item.formula}</code><p><strong>Variables:</strong> {item.variables}</p><p><strong>Units:</strong> {item.units}</p><p><strong>Use when:</strong> {item.use}</p><p className="formula-example"><strong>Example:</strong> {item.example}</p></article>)}</div>
      {!filtered.length && <div className="empty-state"><Search size={20} />No formulas match the current search.</div>}
    </div>
  );
}
