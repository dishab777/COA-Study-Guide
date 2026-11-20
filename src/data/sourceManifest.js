import { chapters } from './syllabus.js';
import { lessonLibrary, practiceProblems } from './lessons.js';

export const sources = [
  { id: 'handout-2026', filename: 'Course Handout 2026.pdf', type: 'Course handout', status: 'available', detail: 'Extracted text is available; defines the 50-lecture course sequence.' },
  { id: 'week3', filename: 'week3-slides.pdf', type: 'Lecture slides', status: 'available', detail: 'Slides on CPU performance, benchmarks, aggregate metrics, and Amdahl’s law.' },
  { id: 'week4', filename: 'week4-slides.pdf', type: 'Lecture slides', status: 'available', detail: 'Slides on control sequencing, microinstruction encodings, and MIPS32 datapath.' },
  { id: 'week9', filename: 'week9-slides.pdf', type: 'Lecture slides', status: 'available', detail: 'Slides on secondary storage and I/O organization.' },
  { id: 'week10', filename: 'week10-slides.pdf', type: 'Lecture slides', status: 'available', detail: 'Slides on DMA, device interfaces, bus standards, and USB.' },
  { id: 'week11', filename: 'week11-slides.pdf', type: 'Lecture slides', status: 'available', detail: 'Slides on MIPS32 pipelining, hazards, branches, and exceptions.' },
  { id: 'week12', filename: 'week12-slides.pdf', type: 'Lecture slides', status: 'available', detail: 'Slides on multicycle operations, ILP, vector processors, multicore, and GPU.' },
];

export const unavailableSources = [
  'October/November 2024 MTE',
  'January 2025 ETE and makeup papers',
  'July 2025 makeup examination',
  'September 2025 MTE',
  'December 2025 ETE',
  'Tutorial sheets and solutions',
  'Pipelining question bank and marking schemes',
  'Lecture PPTs not listed above (including detailed source decks for several handout lectures)',
];

const suppliedSourceByTopic = {
  performance: ['handout-2026', 'week3'],
  'bus-protocols': ['handout-2026', 'week10'],
  'mips-datapath': ['handout-2026', 'week4'],
  'secondary-storage': ['handout-2026', 'week9'],
  'io-module': ['handout-2026', 'week9'],
  'io-addressing': ['handout-2026', 'week9'],
  'programmed-io': ['handout-2026', 'week9'],
  'interrupt-io': ['handout-2026', 'week9'],
  dma: ['handout-2026', 'week10'],
  'io-buses': ['handout-2026', 'week10'],
  'datapath-registers': ['handout-2026', 'week4'],
  'arithmetic-control': ['handout-2026', 'week4'],
  'memory-control': ['handout-2026', 'week4'],
  'hardwired-control': ['handout-2026', 'week4'],
  'microprogrammed-control': ['handout-2026', 'week4'],
  'pipeline-basics': ['handout-2026', 'week11'],
  'structural-hazards': ['handout-2026', 'week11'],
  'data-hazards': ['handout-2026', 'week11'],
  'control-hazards': ['handout-2026', 'week11'],
  'pipeline-exceptions': ['handout-2026', 'week11'],
  'multicycle-execution': ['handout-2026', 'week12'],
  'vector-processing': ['handout-2026', 'week12'],
  'parallel-architecture-overview': ['handout-2026', 'week12'],
  'flynn-taxonomy': ['handout-2026', 'week12'],
  multiprocessors: ['handout-2026', 'week12'],
  multicore: ['handout-2026', 'week12'],
  gpu: ['handout-2026', 'week12'],
  'parallel-tradeoffs': ['handout-2026', 'week12'],
};

export function getTopicEvidence(topic) {
  const sourceIds = suppliedSourceByTopic[topic.id] || ['handout-2026'];
  return {
    sourceIds,
    sourceStatus: sourceIds.length > 1 ? 'slides-available' : 'handout-only',
    teachingStatus: 'outline-mapped',
    practiceStatus: 'not-yet-verified',
    locator: topic.lectures.startsWith('Supplemental') ? 'Supplemental lecture slides; verify individual slide locators during lesson authoring.' : `Course Handout 2026, lecture(s) ${topic.lectures}; slide-level locators pending.`,
  };
}

export const contentManifest = chapters.flatMap((chapter) =>
  chapter.topics.flatMap((topic) => {
    const evidence = getTopicEvidence(topic);
    return topic.subtopics.map((subtopic) => ({
      chapter: chapter.title,
      chapterNumber: chapter.number,
      topic: topic.title,
      topicId: topic.id,
      subtopic,
      handoutLectures: topic.lectures,
      sourceFilenames: evidence.sourceIds.map((id) => sources.find((source) => source.id === id)?.filename).filter(Boolean),
      sourceLocator: evidence.locator,
      contentStatus: evidence.sourceStatus === 'slides-available' ? 'slide-source-available-locator-pending' : 'handout-outline-only',
      teachingStatus: lessonLibrary[topic.id] ? 'lesson-authored-source-review-pending' : 'detailed-lesson-pending',
      practiceStatus: practiceProblems.some((problem) => problem.targetTopicId === topic.id) ? 'generated-practice-available-not-past-paper' : 'topic-specific-practice-pending',
    }));
  }),
);
