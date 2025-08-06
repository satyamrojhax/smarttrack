
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
  // Split by question markers (more flexible)
  const questionBlocks = formattedText.split(/(?:Question\s*\d+[:\.]|Q\d+[:\.]|\d+[\.\)])/i).filter(q => q.trim());
  
  console.log('Parsing questions from text:', formattedText.substring(0, 200));
  console.log('Found question blocks:', questionBlocks.length);
  
  return questionBlocks.map((block, index) => {
    let options: string[] | undefined;
    let correctAnswer: number | undefined;
    let questionText = block.trim();
    
    console.log(`Processing question ${index + 1}:`, questionText.substring(0, 100));
    
    // More flexible option matching for MCQs
    const optionRegex = /(?:[a-d][\)\.]|[A-D][\)\.]|\([a-d]\)|\([A-D]\))\s*([^\n\r]+)/gi;
    const optionMatches = [...questionText.matchAll(optionRegex)];
    
    // More flexible correct answer matching
    const correctAnswerRegex = /(?:correct\s*answer|answer|solution)[:=\s]*[(\[]?([a-d]|[A-D])[)\]]?/gi;
    const correctAnswerMatch = correctAnswerRegex.exec(questionText);
    
    console.log(`Found ${optionMatches.length} options for question ${index + 1}`);
    
    if (optionMatches.length >= 2 && correctAnswerMatch) {
      options = optionMatches.map(match => match[1].trim());
      const correctLetter = correctAnswerMatch[1].toLowerCase();
      correctAnswer = correctLetter.charCodeAt(0) - 97; // Convert a-d to 0-3
      
      console.log(`MCQ detected - Options: ${options.length}, Correct: ${correctLetter} (${correctAnswer})`);
      
      // Clean question text by removing options and answer
      questionText = questionText
        .replace(optionRegex, '')
        .replace(correctAnswerRegex, '')
        .replace(/\n\s*\n/g, '\n')
        .trim();
    }
    
    // If no options found but MCQ was requested, create simple options
    if (!options && questionTypes.includes('MCQ')) {
      console.log(`Creating default options for question ${index + 1}`);
      options = ['Option A', 'Option B', 'Option C', 'Option D'];
      correctAnswer = 0;
    }
    
    const question: GeneratedQuestion = {
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
    
    console.log(`Final question ${index + 1}:`, {
      hasOptions: !!question.options,
      optionsCount: question.options?.length,
      correctAnswer: question.correctAnswer,
      type: question.type
    });
    
    return question;
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
  const mcqInstructions = questionTypes.includes('MCQ') ? `

FOR MCQ QUESTIONS - MANDATORY FORMAT:
- Provide EXACTLY 4 options labeled as:
  a) [first option]
  b) [second option] 
  c) [third option]
  d) [fourth option]
- Then on a new line write: "Correct Answer: [letter]"
- Make sure options are clear and distinct
- Only ONE option should be correct

` : '';

  const cfqInstructions = questionTypes.includes('CFQs') ? `

FOR COMPETENCY FOCUSED QUESTIONS (CFQs):
- Focus on application of concepts and problem-solving skills
- Include scenario-based questions that test analytical thinking
- Emphasize understanding over memorization

` : '';

  const cbqInstructions = questionTypes.includes('CBQs') ? `

FOR CASE BASED QUESTIONS (CBQs):  
- Present a real-world scenario or case study
- Ask questions based on the given case
- Test practical application of theoretical knowledge

` : '';

  return `Create ${questionCount} high-quality practice questions for Class 10 CBSE ${subjectName}, chapter "${chapterName}".

Requirements:
- Question types: ${questionTypes.join(', ')}
- Difficulty: ${difficulty} level
- Make them exam-oriented and based on latest CBSE pattern
- Each question should be numbered clearly as "Question 1:", "Question 2:", etc.

${mcqInstructions}${cfqInstructions}${cbqInstructions}

For other question types, write clear, direct questions that test understanding.

IMPORTANT FORMATTING:
- Start each question with "Question [number]:" 
- For MCQs, always include 4 options and correct answer
- Keep questions focused and exam-relevant
- Use clear, simple language

Example format for MCQ:
Question 1: What is the formula for area of a circle?
a) πr²
b) 2πr  
c) πd
d) πr
Correct Answer: a

Write in a helpful, encouraging tone. Focus on clarity and exam relevance.`;
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
