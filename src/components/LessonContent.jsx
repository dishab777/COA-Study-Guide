import { CheckCircle2, Clock3, Lightbulb, ListChecks } from 'lucide-react';

function Diagram({ topicId }) {
  if (topicId === 'pipeline-basics' || topicId === 'data-hazards') {
    const stages = ['IF', 'ID', 'EX', 'MEM', 'WB'];
    return (
      <figure className="diagram-card">
        <figcaption>Five-stage instruction pipeline — a new instruction enters each cycle when no stall occurs.</figcaption>
        <div className="pipeline-diagram" role="img" aria-label="Five pipeline stages: instruction fetch, decode, execute, memory, and write back">
          {stages.map((stage, index) => <div className="pipeline-stage" key={stage}><b>{stage}</b><span>{['Fetch', 'Decode', 'Execute', 'Memory', 'Write back'][index]}</span></div>)}
        </div>
      </figure>
    );
  }
  if (topicId === 'dma' || topicId === 'io-module') {
    return (
      <figure className="diagram-card">
        <figcaption>DMA data path and CPU setup/completion work.</figcaption>
        <div className="io-diagram" role="img" aria-label="I/O device and DMA controller transfer data directly to memory over a bus; CPU initializes and receives completion interrupt">
          <div className="diagram-node">I/O device</div><span className="diagram-arrow">⇄</span>
          <div className="diagram-node accent">DMA controller</div><span className="diagram-arrow">⇄</span>
          <div className="diagram-node">Main memory</div>
          <div className="diagram-caption">CPU configures DMA → transfer proceeds → completion interrupt</div>
        </div>
      </figure>
    );
  }
  if (topicId === 'functional-units' || topicId === 'operations') {
    return (
      <figure className="diagram-card">
        <figcaption>Instruction and data paths connect the processor to memory and I/O.</figcaption>
        <div className="system-diagram" role="img" aria-label="Input and output connect to a system bus, with the CPU and memory attached; CPU contains control, ALU and registers">
          <div className="diagram-node">Input / output</div><span className="diagram-arrow">↔</span>
          <div className="system-cpu"><strong>CPU</strong><span>Control · ALU · Registers</span></div><span className="diagram-arrow">↔</span>
          <div className="diagram-node">Memory</div>
          <div className="diagram-caption">Address · data · control bus</div>
        </div>
      </figure>
    );
  }
  return null;
}

export default function LessonContent({ topic, lesson, evidence, sourceNames }) {
  if (!lesson) {
    return (
      <section className="pending-lesson" aria-labelledby="pending-heading">
        <div className="pending-icon"><Clock3 size={20} /></div>
        <div>
          <h3 id="pending-heading">Detailed lesson is being source-verified</h3>
          <p>This topic is mapped to the 2026 handout, but its full teaching lesson, examples, and practice set have not yet been authored and checked. It is intentionally not marked complete.</p>
          <p className="source-list">Available evidence: {sourceNames.length ? sourceNames.join(', ') : 'Course Handout 2026'}. {evidence.locator}</p>
          <a className="button button-secondary" href="./legacy.html">Open the existing guide notes</a>
        </div>
      </section>
    );
  }

  return (
    <div className="lesson-body">
      <section className="lesson-section">
        <h3><Lightbulb size={18} /> Introduction</h3>
        <p>{lesson.introduction}</p>
        <div className="why-box"><strong>Why it matters</strong><p>{lesson.why}</p></div>
      </section>
      <Diagram topicId={topic.id} />
      <section className="lesson-section">
        <h3><ListChecks size={18} /> Prerequisites</h3>
        <ul className="lesson-list">{lesson.prerequisites.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>
      <section className="lesson-section">
        <h3>Step-by-step explanation</h3>
        <ol className="lesson-list numbered">{lesson.explanation.map((item) => <li key={item}>{item}</li>)}</ol>
      </section>
      {lesson.workedExample && (
        <section className="worked-example">
          <div className="section-kicker">Worked example · {lesson.workedExample.title}</div>
          <p><strong>Given:</strong> {lesson.workedExample.given}</p>
          <ol className="lesson-list numbered">{lesson.workedExample.steps.map((item) => <li key={item}>{item}</li>)}</ol>
          <div className="answer-box"><CheckCircle2 size={17} /><span><strong>Answer:</strong> {lesson.workedExample.answer}</span></div>
        </section>
      )}
      <section className="lesson-section">
        <h3>Formula reference</h3>
        {lesson.formulas.map((formula) => <div className="formula-row" key={formula}><code>{formula}</code><button className="icon-button copy-formula" data-copy={formula} aria-label={`Copy ${formula}`}>Copy</button></div>)}
      </section>
      <p className="source-note"><strong>Source and scope:</strong> {lesson.sourceNote}</p>
      <p className="coverage-caveat">This lesson has been authored for this study guide. It does not claim that generated practice examples appeared in an examination.</p>
    </div>
  );
}
