import { chapters } from './syllabus.js';
import { lessonLibrary, practiceProblems } from './lessons.js';
import { examPapers, tutorialSets } from './examBank.js';

export const sources = [
  { id: 'handout-2026', filename: 'Course Handout 2026.pdf', type: 'Course handout', status: 'available', detail: 'Extracted text is available; defines the 50-lecture course sequence.' },
  { id: 'week3', filename: 'week3-slides.pdf', type: 'Lecture slides', status: 'available', detail: 'Slides on CPU performance, benchmarks, aggregate metrics, and Amdahl’s law.' },
  { id: 'week4', filename: 'week4-slides.pdf', type: 'Lecture slides', status: 'available', detail: 'Slides on control sequencing, microinstruction encodings, and MIPS32 datapath.' },
  { id: 'week4-pptx', filename: 'Week4_Slides.pptx', type: 'Lecture slides', status: 'available', detail: '71 slides; text extracted locally. Covers control sequences, microprogramming, and MIPS32 implementation.' },
  { id: 'week9', filename: 'week9-slides.pdf', type: 'Lecture slides', status: 'available', detail: 'Slides on secondary storage and I/O organization.' },
  { id: 'week10', filename: 'week10-slides.pdf', type: 'Lecture slides', status: 'available', detail: 'Slides on DMA, device interfaces, bus standards, and USB.' },
  { id: 'week11', filename: 'week11-slides.pdf', type: 'Lecture slides', status: 'available', detail: 'Slides on MIPS32 pipelining, hazards, branches, and exceptions.' },
  { id: 'week12', filename: 'week12-slides.pdf', type: 'Lecture slides', status: 'available', detail: 'Slides on multicycle operations, ILP, vector processors, multicore, and GPU.' },
  { id: 'nptel-lecture12', filename: 'Chapter 1 - Lecture 12 in Week 3 NPTEL.pdf', type: 'Lecture slides', status: 'available', detail: 'Three-page performance lecture extract; overlaps the CPU-performance material in week3-slides.pdf.' },
  { id: 'chapter1-basics', filename: 'chapter 1-Basic Structure of Computers.ppt', type: 'Lecture slides', status: 'available', detail: '35-slide legacy PowerPoint text extraction; slide locators are mapped for functional units, operations, buses, and performance.' },
  { id: 'chapter2-instructions', filename: 'chapter2- Machine Instructions and Programs.ppt', type: 'Lecture slides', status: 'available', detail: '65-slide legacy PowerPoint text extraction on number representation, instruction execution, addressing, and assembly.' },
  { id: 'chapter5-memory', filename: 'chapter5-the memory system.ppt', type: 'Lecture slides', status: 'available', detail: '17-slide legacy PowerPoint text extraction on memory hierarchy, locality, cache mapping, hits, and misses.' },
  { id: 'chapter6-arithmetic', filename: 'Completed\\chapter6-Arithmetic.ppt', type: 'Lecture slides', status: 'available', detail: '44-slide legacy PowerPoint text extraction on adders, carry logic, multiplication, and division.' },
  { id: 'chapter8-pipelining', filename: 'Completed\\chapter 8- Pipelining.ppt', type: 'Lecture slides', status: 'available', detail: '61-slide legacy PowerPoint text extraction on pipeline performance and hazards; the mapped citations use the page-indexed week11 deck.' },
  { id: 'io-lectures', filename: 'L44 to L48 - Input Output Organzation.pptx', type: 'Lecture slides', status: 'available', detail: '71 slides; OCR text extracted locally. Covers I/O, interrupts, DMA, device interfacing, buses, and USB.' },
  { id: 'selected-nptel', filename: 'Completed\\Selected slides of NPTEL as per syllabus.pptx', type: 'Lecture slides', status: 'available', detail: '55 slides; OCR text extracted locally for MIPS32 pipelining, structural/data/control hazards, and branch handling.' },
  { id: 'week7-deck', filename: 'Completed\\week7-slides.pptx', type: 'Lecture slides', status: 'available', detail: '75 slides; OCR text extracted locally for integer representations, adders, multipliers, and dividers.' },
  { id: 'parallel-architectures', filename: 'Parallel Processing Architectures.pdf', type: 'Lecture slides', status: 'available', detail: 'Nine-page PDF on parallel architectures.' },
  { id: 'three-bus-sequences', filename: 'Three_Bus_Control_Sequences.pdf', type: 'Control-sequence examples', status: 'available', detail: 'Two-page register-transfer/control-sequence reference for a three-bus datapath.' },
  { id: 'assembly-examples', filename: 'Assembly Example questions.docx', type: 'Assembly exercises', status: 'available', detail: 'Selected worked assembly examples for loops, conditions, arrays, and data movement.' },
  { id: 'formula-list', filename: 'Formula_List_Q15_Q21.docx', type: 'Formula reference', status: 'available', detail: 'Formula sheet for hit/miss ratios, effective memory access time, speedup, and multilevel caches.' },
  { id: 'pipeline-questions', filename: 'Completed\\Pipelining_Questions.docx', type: 'Practice question bank', status: 'available', detail: 'Seventeen worked pipeline practice questions; these are not verified university past-paper questions.' },
  { id: 'tutorial-1', filename: 'Tutorial 1.pdf', type: 'Tutorial sheet', status: 'available', detail: 'Four pages of machine-operation and computer-performance exercises.' },
  { id: 'tutorial-2', filename: 'Tutorial 2.docx', type: 'Tutorial sheet', status: 'available', detail: '43 numbered paragraphs covering signed numbers, overflow, assembly, and byte order.' },
  { id: 'tutorial-3', filename: 'Tutorial 3.docx', type: 'Tutorial sheet', status: 'available', detail: '33 numbered paragraphs covering arrays, addressing modes, and instruction formats.' },
  { id: 'tutorial-5', filename: 'Tutorial 5.pdf', type: 'Tutorial sheet', status: 'available', detail: 'Five pages, questions 1-21, on cache mapping and performance.' },
  { id: 'tutorial-6', filename: 'COA_Computer_Arithmetic_Tutorial 6.pdf', type: 'Tutorial sheet', status: 'available', detail: 'Two pages, questions 1-9, on adders, multiplication, and division.' },
  { id: 'tutorial-io', filename: 'Solved I_O Tutorial.pdf', type: 'Tutorial solutions', status: 'available', detail: 'Eleven pages with worked answers for six I/O transfer problems.' },
  { id: 'last-unit-slides', filename: 'Last Unit Slides.pdf', type: 'Lecture slides', status: 'available', detail: 'Nine-page overview of Flynn classification, superscalar, vector, multicore, and GPU architectures.' },
  { id: 'paper-mte-oct24', filename: 'CSE2103_COA.pdf', type: 'Examination paper', status: 'available', detail: 'October 2024 Odd Semester MTE question paper; two pages.' },
  { id: 'solution-mte-nov24', filename: 'MTE Solution COA 2024.pdf', type: 'Examination solution', status: 'available', detail: 'Four-page solution labeled November 2024; exact match to the October 2024 question paper is unverified.' },
  { id: 'paper-makeup-jan25-a', filename: 'CSE2103_Computer Organization and Architecture_1.pdf', type: 'Examination paper', status: 'available', detail: 'January 2025 Odd Semester Makeup question paper, variant A; two pages.' },
  { id: 'paper-makeup-jan25-b', filename: 'CSE2103_Computer Organization and Architecture_2.pdf', type: 'Examination paper', status: 'available', detail: 'January 2025 Odd Semester Makeup question paper, variant B; two pages.' },
  { id: 'solution-jan25-unmatched', filename: 'ETE 2024.pdf', type: 'Examination solution', status: 'available', detail: 'Eight-page solution whose internal cover says January 2025 Makeup; filename and question-set match are inconsistent.' },
  { id: 'paper-makeup-jul25', filename: 'Makeup 2025.pdf', type: 'Examination paper and solution', status: 'available', detail: 'July 2025 Odd Semester Makeup questions with supplied worked answers and partial rubric; eight pages.' },
  { id: 'paper-mte-sep25', filename: 'MTE Q Paper COA solution 2025.pdf', type: 'Examination paper and solution', status: 'available', detail: 'September 2025 Odd Semester MTE question paper, solution, and marking scheme; four pages.' },
  { id: 'paper-resessional-nov25', filename: 'CSE2103_COA Resessional_Solution.docx', type: 'Examination paper and solution', status: 'available', detail: 'November 2025 Odd Semester Re-sessional questions with solutions and partial rubric; paragraph locators retained.' },
  { id: 'paper-ete-dec25', filename: 'CSE2103_COA_Set1.pdf', type: 'Examination paper', status: 'available', detail: 'December 2025 Odd Semester ETE question paper; two pages. A byte-identical copy is excluded.' },
  { id: 'solution-ete-dec25', filename: 'Updated ETE Q Paper COA Solution.pdf', type: 'Examination solution and marking scheme', status: 'available', detail: 'Ten-page December 2025 ETE solution and marking scheme.' },
  { id: 'paper-makeup-dec25', filename: 'CSE2103_Computer Organization and Architecture.pdf', type: 'Examination paper', status: 'available', detail: 'December 2025 Odd Semester Makeup question paper; two pages.' },
  { id: 'solution-makeup-dec25', filename: 'CSE2103_Computer Organization and Architecture_PV.pdf', type: 'Examination solution', status: 'available', detail: 'Eight-page solution set matching the December 2025 Makeup question paper.' },
];

export const unavailableSources = [
  'December 2024 ETE question paper (the file named ETE 2024.pdf is internally labeled January 2025 Makeup)',
  'Matching solution/marking schemes for the two January 2025 Makeup question-paper variants',
  'Verified solution pairing for the October 2024 MTE and the November-labeled 2024 solution document',
  'Complete official marking schemes for every supplied examination session',
  'Official worked solutions for Tutorials 1, 2, 3, 5, and 6',
];

const suppliedSourceByTopic = {
  'computer-types': ['handout-2026', 'chapter1-basics'],
  'functional-units': ['handout-2026', 'chapter1-basics'],
  operations: ['handout-2026', 'chapter1-basics', 'week4-pptx'],
  buses: ['handout-2026', 'chapter1-basics', 'week10', 'io-lectures'],
  performance: ['handout-2026', 'week3', 'nptel-lecture12', 'chapter1-basics'],
  'bus-protocols': ['handout-2026', 'week10', 'io-lectures'],
  'number-representation': ['handout-2026', 'chapter2-instructions', 'week7-deck', 'tutorial-2'],
  'memory-addresses': ['handout-2026', 'chapter2-instructions', 'tutorial-2', 'tutorial-3'],
  'instruction-sequencing': ['handout-2026', 'chapter1-basics', 'chapter2-instructions', 'tutorial-1'],
  'assembly-notation': ['handout-2026', 'chapter2-instructions', 'assembly-examples', 'tutorial-2'],
  'branching-addresses': ['handout-2026', 'chapter2-instructions', 'assembly-examples', 'tutorial-2'],
  'addressing-modes': ['handout-2026', 'chapter2-instructions', 'assembly-examples', 'tutorial-3'],
  'assembly-programs': ['handout-2026', 'chapter2-instructions', 'assembly-examples', 'tutorial-2', 'tutorial-3'],
  'arithmetic-circuits': ['handout-2026', 'chapter6-arithmetic', 'week7-deck', 'tutorial-6'],
  'io-module': ['handout-2026', 'week9', 'io-lectures', 'tutorial-io'],
  'io-addressing': ['handout-2026', 'week9', 'io-lectures', 'tutorial-io'],
  'programmed-io': ['handout-2026', 'chapter2-instructions', 'week9', 'io-lectures', 'tutorial-io'],
  'interrupt-io': ['handout-2026', 'week9', 'io-lectures', 'tutorial-io'],
  dma: ['handout-2026', 'week10', 'io-lectures', 'tutorial-io'],
  'io-buses': ['handout-2026', 'week10', 'io-lectures'],
  'memory-hierarchy': ['handout-2026', 'chapter5-memory', 'tutorial-5'],
  'direct-mapping': ['handout-2026', 'chapter5-memory', 'tutorial-5'],
  'associative-mapping': ['handout-2026', 'chapter5-memory', 'tutorial-5'],
  'set-associative-mapping': ['handout-2026', 'chapter5-memory', 'tutorial-5'],
  'cache-performance': ['handout-2026', 'chapter5-memory', 'formula-list', 'tutorial-1', 'tutorial-5'],
  'secondary-storage': ['handout-2026', 'chapter5-memory', 'week9'],
  'datapath-registers': ['handout-2026', 'week4', 'week4-pptx', 'three-bus-sequences'],
  'arithmetic-control': ['handout-2026', 'week4', 'week4-pptx', 'three-bus-sequences'],
  'memory-control': ['handout-2026', 'week4', 'week4-pptx', 'three-bus-sequences'],
  'hardwired-control': ['handout-2026', 'week4', 'week4-pptx'],
  'microprogrammed-control': ['handout-2026', 'week4', 'week4-pptx'],
  'mips-datapath': ['handout-2026', 'week4', 'week4-pptx', 'selected-nptel'],
  'pipeline-basics': ['handout-2026', 'week11', 'chapter8-pipelining', 'selected-nptel', 'pipeline-questions'],
  'structural-hazards': ['handout-2026', 'week11', 'chapter8-pipelining', 'selected-nptel'],
  'data-hazards': ['handout-2026', 'week11', 'chapter8-pipelining', 'selected-nptel', 'pipeline-questions'],
  'control-hazards': ['handout-2026', 'week11', 'chapter8-pipelining', 'selected-nptel', 'pipeline-questions'],
  'pipeline-exceptions': ['handout-2026', 'week11', 'chapter8-pipelining', 'selected-nptel'],
  'multicycle-execution': ['handout-2026', 'week12', 'pipeline-questions'],
  'vector-processing': ['handout-2026', 'week12', 'last-unit-slides'],
  'parallel-architecture-overview': ['handout-2026', 'week12', 'parallel-architectures', 'last-unit-slides'],
  'parallel-basics': ['handout-2026', 'week12', 'parallel-architectures', 'last-unit-slides'],
  'flynn-taxonomy': ['handout-2026', 'week12', 'parallel-architectures', 'last-unit-slides'],
  multiprocessors: ['handout-2026', 'week12', 'parallel-architectures', 'last-unit-slides'],
  multicore: ['handout-2026', 'week12', 'parallel-architectures', 'last-unit-slides'],
  gpu: ['handout-2026', 'week12', 'parallel-architectures', 'last-unit-slides'],
  'parallel-tradeoffs': ['handout-2026', 'week12', 'parallel-architectures', 'last-unit-slides'],
};

const topicLocators = {
  'computer-types': 'chapter 1-Basic Structure of Computers.ppt, slides 2-3 and 33; Last Unit Slides.pdf, pp. 2-9 for parallel classes.',
  'functional-units': 'chapter 1-Basic Structure of Computers.ppt, slides 4-9.',
  operations: 'chapter 1-Basic Structure of Computers.ppt, slides 10-18; week4-slides.pdf, slides 2-9.',
  buses: 'chapter 1-Basic Structure of Computers.ppt, slides 19-21; week10-slides.pdf, slides 19-29.',
  performance: 'week3-slides.pdf, slides 1-15; chapter 1-Basic Structure of Computers.ppt, slides 25-35.',
  'bus-protocols': 'week10-slides.pdf, slides 19-29.',
  'number-representation': 'chapter2- Machine Instructions and Programs.ppt, slides 3-14; week7-slides.pptx, slides 3-9.',
  'memory-addresses': 'chapter2- Machine Instructions and Programs.ppt, slides 15-22; Tutorial 2.docx, paragraphs 41-43.',
  'instruction-sequencing': 'chapter2- Machine Instructions and Programs.ppt, slides 23-39 and 61-65; Tutorial 1.pdf, p. 1.',
  'assembly-notation': 'chapter2- Machine Instructions and Programs.ppt, slides 25-32 and 61-65; Tutorial 2.docx, paragraphs 16-18.',
  'branching-addresses': 'chapter2- Machine Instructions and Programs.ppt, slides 35-41 and 49-52; Tutorial 2.docx, paragraphs 20-40.',
  'addressing-modes': 'chapter2- Machine Instructions and Programs.ppt, slides 40-52; Tutorial 3.docx, paragraphs 13-19.',
  'assembly-programs': 'chapter2- Machine Instructions and Programs.ppt, slides 25-56; Tutorial 2.docx, paragraphs 20-40; Tutorial 3.docx, paragraphs 3-12 and 20-33.',
  'arithmetic-circuits': 'chapter6-Arithmetic.ppt, slides 2-44; week7-slides.pptx, slides 10-75; Tutorial 6, questions 1-9.',
  'io-module': 'week9-slides.pdf, slides 12-17; Solved I_O Tutorial.pdf, pp. 1-2.',
  'io-addressing': 'week9-slides.pdf, slides 15-17; Solved I_O Tutorial.pdf, pp. 1-2.',
  'programmed-io': 'week9-slides.pdf, slides 14-21; week10-slides.pdf, slides 14-18; Solved I_O Tutorial.pdf, pp. 1-2.',
  'interrupt-io': 'week9-slides.pdf, slides 22-38; Solved I_O Tutorial.pdf, pp. 5-6.',
  dma: 'week10-slides.pdf, slides 1-7 and 14-18; Solved I_O Tutorial.pdf, pp. 2-4 and 7-11.',
  'io-buses': 'week10-slides.pdf, slides 19-37.',
  'memory-hierarchy': 'chapter5-the memory system.ppt, slides 1-10.',
  'direct-mapping': 'chapter5-the memory system.ppt, slides 11-12; Tutorial 5, pp. 1-2.',
  'associative-mapping': 'chapter5-the memory system.ppt, slides 11 and 13; Tutorial 5, pp. 2-3.',
  'set-associative-mapping': 'chapter5-the memory system.ppt, slides 11 and 14; Tutorial 5, pp. 3-4.',
  'cache-performance': 'chapter5-the memory system.ppt, slides 15-17; Formula_List_Q15_Q21.docx, sections 1-6; Tutorial 5, pp. 4-5.',
  'secondary-storage': 'week9-slides.pdf, slides 1-10; chapter5-the memory system.ppt, slides 1-4.',
  'datapath-registers': 'week4-slides.pdf, slides 2-9; Three_Bus_Control_Sequences.pdf, pp. 1-2.',
  'arithmetic-control': 'week4-slides.pdf, slides 6-9; Three_Bus_Control_Sequences.pdf, pp. 1-2.',
  'memory-control': 'week4-slides.pdf, slides 5-8; Three_Bus_Control_Sequences.pdf, pp. 1-2.',
  'hardwired-control': 'week4-slides.pdf, slide 10; November 2025 Re-sessional solution, DOCX paragraphs 85-126.',
  'microprogrammed-control': 'week4-slides.pdf, slides 11-12; November 2025 Re-sessional solution, DOCX paragraphs 85-126.',
  'mips-datapath': 'week4-slides.pdf, slides 13-18; Selected slides of NPTEL, slides 1-12.',
  'pipeline-basics': 'week11-slides.pdf, slides 1-16; Selected slides of NPTEL, slides 1-12.',
  'structural-hazards': 'week11-slides.pdf, slides 17-21; Selected slides of NPTEL, slides 13-21.',
  'data-hazards': 'week11-slides.pdf, slides 22-30; Selected slides of NPTEL, slides 22-40.',
  'control-hazards': 'week11-slides.pdf, slides 31-38 and 42-49; Selected slides of NPTEL, slides 41-55.',
  'pipeline-exceptions': 'week11-slides.pdf, slides 39-41.',
  'multicycle-execution': 'week12-slides.pdf, slides 1-15; Pipelining_Questions.docx, questions 7-8 and 15-17.',
  'vector-processing': 'week12-slides.pdf, slides 16-24; Last Unit Slides.pdf, p. 5.',
  'parallel-architecture-overview': 'week12-slides.pdf, slides 25-49; Parallel Processing Architectures.pdf, pp. 1-9.',
  'parallel-basics': 'week12-slides.pdf, slides 25-49; Parallel Processing Architectures.pdf, pp. 1-9.',
  'flynn-taxonomy': 'week12-slides.pdf, slide 27; Last Unit Slides.pdf, p. 2.',
  multiprocessors: 'week12-slides.pdf, slides 30-33; Last Unit Slides.pdf, pp. 6-7.',
  multicore: 'week12-slides.pdf, slides 25-33; Last Unit Slides.pdf, pp. 6-7.',
  gpu: 'week12-slides.pdf, slides 34-35; Last Unit Slides.pdf, p. 8.',
  'parallel-tradeoffs': 'week12-slides.pdf, slides 30-49; Parallel Processing Architectures.pdf, pp. 1-9.',
};

export function getTopicEvidence(topic) {
  const sourceIds = suppliedSourceByTopic[topic.id] || ['handout-2026'];
  return {
    sourceIds,
    sourceStatus: sourceIds.length > 1 ? 'slides-available' : 'handout-only',
    teachingStatus: lessonLibrary[topic.id] ? 'lesson-authored' : 'outline-mapped',
    locator: topicLocators[topic.id] || `Course Handout 2026, lecture(s) ${topic.lectures}.`,
  };
}

export const contentManifest = chapters.flatMap((chapter) =>
  chapter.topics.flatMap((topic) => {
    const evidence = getTopicEvidence(topic);
    const topicExamQuestions = examPapers.flatMap((paper) =>
      paper.questions
        .filter((question) => question.topicIds.includes(topic.id))
        .map((question) => ({ paper, question })),
    );
    const topicTutorialSets = tutorialSets.filter((set) => evidence.sourceIds.includes(set.sourceId));
    return topic.subtopics.map((subtopic) => ({
      chapter: chapter.title,
      chapterNumber: chapter.number,
      topic: topic.title,
      topicId: topic.id,
      subtopic,
      handoutLectures: topic.lectures,
      sourceFilenames: evidence.sourceIds.map((id) => sources.find((source) => source.id === id)?.filename).filter(Boolean),
      sourceLocator: evidence.locator,
      contentStatus: topicLocators[topic.id] ? 'page-or-slide-located' : 'handout-outline-only',
      teachingStatus: lessonLibrary[topic.id] ? 'lesson-authored' : 'detailed-lesson-pending',
      practiceStatus: practiceProblems.some((problem) => problem.targetTopicId === topic.id && problem.practiceKind === 'Tutorial-derived')
        ? 'tutorial-exercise-available'
        : practiceProblems.some((problem) => problem.targetTopicId === topic.id)
          ? 'generated-practice-available-not-past-paper'
          : 'topic-specific-practice-pending',
      examQuestionCount: topicExamQuestions.length,
      examSessions: [...new Set(topicExamQuestions.map(({ paper }) => paper.session))].join('; '),
      examQuestionEvidence: topicExamQuestions.map(({ paper, question }) => {
        const paperSource = sources.find((source) => source.id === paper.paperSourceId);
        return `${paper.session} ${question.number} (${question.locator}) · ${paperSource?.filename || paper.paperSourceId}`;
      }).join('; '),
      tutorialSources: topicTutorialSets.map((set) => `${set.title} (${set.locator})`).join('; '),
    }));
  }),
);
