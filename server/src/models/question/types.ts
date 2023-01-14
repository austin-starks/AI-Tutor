export type Question =
  | MultipleChoice
  | ShortAnswer
  | Essay
  | FillInTheBlank
  | string;

export interface MultipleChoice {
  question: string;
  answerChoices: string[];
}

export interface ShortAnswer {
  question: string;
}

export interface Essay {
  prompt: string;
  wordMin: number;
  wordMax: number;
}

export interface FillInTheBlank {
  statement: string;
}

export interface QuestionRequest {
  subject: SubjectEnum;
  questionType: QuestionTypeEnum;
  context: string;
  question: Question;
}

export interface QuestionResponse {
  id: string;
  answer: string;
  balance: number;
}

export type AdditionalOptions = AdditionalOption[];

export interface AdditionalOption {
  explainAnswer: boolean;
}

export enum SubjectEnum {
  MATH = "math",
  SCIENCE = "science",
  ENGLISH = "english",
  HISTORY = "history",
  GENERAL = "General",
}

export enum QuestionTypeEnum {
  MultipleChoice = "multiple choice",
  ShortAnswer = "short answer",
  Essay = "essay",
  FillInTheBlank = "fill in the blank",
  OTHER = "other",
}
