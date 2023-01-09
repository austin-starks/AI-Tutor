import axios, { AxiosResponse } from "axios";

type Question = MultipleChoice | ShortAnswer | Essay | FillInTheBlank;

interface MultipleChoice {
  question: string;
  answerChoices: string[];
}

interface ShortAnswer {
  question: string;
}

interface Essay {
  prompt: string;
  wordMin: number;
  wordMax: number;
}

interface FillInTheBlank {
  statement: string;
}

export interface QuestionRequest {
  subject: SubjectEnum;
  context: string;
  questionType: QuestionTypeEnum;
  question: Question;
}

export interface QuestionResponse {
  balance: number;
  answer: string;
  id?: string;
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
  GENERAL = "",
}

export enum QuestionTypeEnum {
  ShortAnswer = "short answer",
  Essay = "essay",
  FillInTheBlank = "fill in the blank",
  MultipleChoice = "multiple choice",
  OTHER = "other",
}

export interface QuestionCost {
  [QuestionTypeEnum.ShortAnswer]: number;
  [QuestionTypeEnum.Essay]: number;
  [QuestionTypeEnum.FillInTheBlank]: number;
  [QuestionTypeEnum.MultipleChoice]: number;
  [QuestionTypeEnum.OTHER]: number;
}

export const getQuestionCosts = async (): Promise<AxiosResponse> =>
  axios.get(`/api/question/costs`);

export const ask = async (
  data: QuestionRequest
): Promise<AxiosResponse<QuestionResponse>> =>
  axios.post(`/api/question`, data);

export const submitQuestionFeedback = async (
  questionId: string,
  question: QuestionRequest,
  answer: string,
  feedback: "good" | "bad"
): Promise<AxiosResponse> =>
  axios.post(`/api/question/feedback`, {
    id: questionId,
    question,
    answer,
    feedback,
  });
