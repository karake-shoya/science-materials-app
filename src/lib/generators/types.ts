export type GeneratorFormat = 'basic' | 'graphical' | 'comprehensive';

export interface GraphData {
  type: 'line' | 'scatter';
  xAxis: { label: string; min: number; max: number; step: number; unit?: string };
  yAxis: { label: string; min: number; max: number; step: number; unit?: string };
  points: { x: number; y: number }[];
}

export interface TableData {
  headers: string[];
  rows: string[][];
}

export interface QuestionElement {
  type: 'graph' | 'table';
  data: GraphData | TableData;
}

export interface SubQuestion {
  text: string;
  answer: string;
  unit: string;
}

export interface QuestionData {
  text: string;
  answer: string;
  unit: string;
  elements?: QuestionElement[];
  subQuestions?: SubQuestion[];
}

export interface GeneratorResult {
  title: string;
  questions: QuestionData[];
}

export type Grade = 1 | 2 | 3;

export interface ScienceTopic {
  id: string;
  name: string;
  grade: Grade;
}

export const SCIENCE_TOPICS: ScienceTopic[] = [
  { id: 'density', name: '密度', grade: 1 },
  { id: 'concentration', name: '質量パーセント濃度', grade: 1 },
  { id: 'pressure', name: '圧力', grade: 2 },
  { id: 'omega', name: 'オームの法則', grade: 2 },
  { id: 'humidity', name: '湿度', grade: 2 },
  { id: 'power', name: '電力・熱量・電力量', grade: 2 },
  { id: 'work', name: '仕事・仕事率', grade: 3 },
  { id: 'speed', name: '速さ', grade: 3 },
];

export interface ProblemGenerator {
  generate(count: number, format: GeneratorFormat): QuestionData[];
  title: string;
}
