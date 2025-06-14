
import { GeneratedQuestion } from './types';

export const formatAIResponse = (text: string): string => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/#{1,6}\s*/g, '')
    .replace(/\n\s*\n/g, '\n\n')
    .replace(/^\s+|\s+$/g, '');
};

export const parseQuestions = (formattedText: string, questionTypes: string[], difficulty: string, subjectName: string, chapterName: string): GeneratedQuestion[] => {
  const questionBlocks = formattedText.split(/Question\s*\d+:/i).filter(q => q.trim());
  
  return questionBlocks.map((block, index) => {
    let options: string[] | undefined;
    let correctAnswer: number | undefined;
    let questionText = block.trim();
    
    // Check if it's an MCQ
    const optionMatches = block.match(/[a-d]\)\s*([^\n]+)/gi);
    const correctAnswerMatch = block.match(/Correct Answer:\s*([a-d])/i);
    
    if (optionMatches && optionMatches.length === 4 && correctAnswerMatch) {
      options = optionMatches.map(opt => opt.replace(/[a-d]\)\s*/, '').trim());
      const correctLetter = correctAnswerMatch[1].toLowerCase();
      correctAnswer = correctLetter.charCodeAt(0) - 97; // Convert a-d to 0-3
      
      // Remove options and correct answer from question text
      questionText = questionText
        .replace(/[a-d]\)\s*[^\n]+/gi, '')
        .replace(/Correct Answer:\s*[a-d]/i, '')
        .trim();
    }
    
    return {
      id: `${Date.now()}-${index}`,
      question: questionText,
      type: questionTypes[index % questionTypes.length],
      difficulty,
      subject: subjectName,
      chapter: chapterName,
      timestamp: Date.now(),
      options,
      correctAnswer
    };
  });
};

export const exportQuestions = (questions: GeneratedQuestion[]) => {
  const questionsText = questions.map((q, index) => 
    `Question ${index + 1}:\n${q.question}\n${q.options ? q.options.map((opt, i) => `${String.fromCharCode(97 + i)}) ${opt}`).join('\n') : ''}\n${q.answer ? `\nSolution:\n${q.answer}` : ''}\n${'='.repeat(50)}\n\n`
  ).join('');
  
  const blob = new Blob([questionsText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `practice-questions-${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
};

export const generateQuestionsPrompt = (
  questionCount: string,
  subjectName: string,
  chapterName: string,
  questionTypes: string[],
  difficulty: string
): string => {
  return `Create ${questionCount} high-quality practice questions for Class 10 CBSE ${subjectName}, chapter "${chapterName}".

Requirements:
- Question types: ${questionTypes.join(', ')}
- Difficulty: ${difficulty} level
- Make them exam-oriented and based on latest CBSE pattern
- DO NOT include any context or introduction as the first question

For MCQ questions, provide exactly 4 options labeled as:
a) [option 1]
b) [option 2] 
c) [option 3]
d) [option 4]

Then clearly state: "Correct Answer: [letter]"

For other question types, write clear, direct questions that test understanding.

Format each question as:
Question 1: [question text]
[If MCQ, include options and correct answer]

Question 2: [question text]
[If MCQ, include options and correct answer]

And so on...

Write in a friendly, encouraging tone like a helpful tutor. Focus on clarity and exam relevance.`;
};

export const generateSolutionPrompt = (question: GeneratedQuestion): string => {
  return `Provide a SHORT and CONCISE solution for this Class 10 CBSE ${question.subject} question from "${question.chapter}":

${question.question}

${question.options ? `Options:\na) ${question.options[0]}\nb) ${question.options[1]}\nc) ${question.options[2]}\nd) ${question.options[3]}` : ''}

IMPORTANT: Give ONLY a brief, direct answer. Keep it under 100 words. Include:
1. The correct answer (if MCQ)
2. ONE key explanation line
3. Main concept involved

Be concise and to the point. No lengthy explanations.`;
};
