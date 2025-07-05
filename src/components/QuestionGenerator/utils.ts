
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
  const isMath = subjectName.toLowerCase().includes('math');
  
  if (isMath) {
    return `Create ${questionCount} high-quality Class 10 CBSE Mathematics practice questions for chapter "${chapterName}".

IMPORTANT REQUIREMENTS:
- Generate questions that are frequently asked in CBSE Class 10 Board Exams
- Include Previous Year Questions (PYQs) patterns and important exam-oriented questions
- Focus on questions with HIGH PROBABILITY of appearing in exams
- Question types: ${questionTypes.join(', ')}
- Difficulty: ${difficulty} level

For Mathematics questions, ensure:
- Step-by-step solutions with clear mathematical reasoning
- Include formula applications and theorem usage
- Show complete working with proper mathematical notation
- Cover important concepts that are exam favorites

For MCQ questions, provide exactly 4 options:
a) [option 1]
b) [option 2] 
c) [option 3]
d) [option 4]

Then clearly state: "Correct Answer: [letter]"

For Long Answer/Application questions:
- Create real-world problem scenarios
- Include multiple steps requiring different concepts
- Ensure questions test deep understanding

Format each question as:
Question 1: [question text]
[If MCQ, include options and correct answer]

Question 2: [question text]
[If MCQ, include options and correct answer]

Focus on CBSE exam pattern, important theorems, and frequently tested concepts.`;
  }
  
  return `Create ${questionCount} high-quality practice questions for Class 10 CBSE ${subjectName}, chapter "${chapterName}".

Requirements:
- Question types: ${questionTypes.join(', ')}
- Difficulty: ${difficulty} level
- Make them exam-oriented and based on latest CBSE pattern
- Include Previous Year Questions patterns
- Focus on important and frequently asked concepts

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

Write in a friendly, encouraging tone like a helpful tutor. Focus on clarity and exam relevance.`;
};

export const generateSolutionPrompt = (question: GeneratedQuestion): string => {
  const isMath = question.subject.toLowerCase().includes('math');
  
  if (isMath) {
    return `Provide a DETAILED step-by-step solution for this Class 10 CBSE Mathematics question from "${question.chapter}":

${question.question}

${question.options ? `Options:\na) ${question.options[0]}\nb) ${question.options[1]}\nc) ${question.options[2]}\nd) ${question.options[3]}` : ''}

IMPORTANT: Provide a COMPLETE mathematical solution with:

1. **Given/To Find:** Clearly state what is given and what needs to be found
2. **Formula/Theorem:** Mention the relevant formula or theorem used
3. **Step-by-Step Solution:** Show each calculation step clearly
4. **Mathematical Working:** Include all algebraic steps, substitutions, and calculations
5. **Final Answer:** Clearly highlight the final answer
6. **Verification:** If possible, verify the answer

Use proper mathematical notation and explain the reasoning behind each step. Make it detailed enough for a Class 10 student to understand completely.`;
  }
  
  return `Provide a clear and detailed solution for this Class 10 CBSE ${question.subject} question from "${question.chapter}":

${question.question}

${question.options ? `Options:\na) ${question.options[0]}\nb) ${question.options[1]}\nc) ${question.options[2]}\nd) ${question.options[3]}` : ''}

IMPORTANT: Give a comprehensive answer including:
1. The correct answer (if MCQ)
2. Detailed explanation with reasoning
3. Key concepts involved
4. Step-by-step approach
5. Important points to remember

Make it detailed and educational for Class 10 CBSE students.`;
};
