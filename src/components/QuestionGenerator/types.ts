
export interface GeneratedQuestion {
  id: string;
  question: string;
  answer?: string;
  type: string;
  difficulty: string;
  subject: string;
  chapter: string;
  timestamp: number;
  options?: string[];
  correctAnswer?: number;
}

export interface QuestionFormData {
  selectedSubject: string;
  selectedChapter: string;
  difficulty: string;
  questionTypes: string[];
  questionCount: string;
}
