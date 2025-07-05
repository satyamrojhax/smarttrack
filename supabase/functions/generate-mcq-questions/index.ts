
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Using the same Gemini API key that's used in DoubtAssistant
const geminiApiKey = 'AIzaSyDi1wHRLfS2-g4adHzuVfZRzmI4tRrzH-U';
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabase.auth.getUser(token);

    if (!user) {
      throw new Error('Unauthorized');
    }

    const { subjectId, subjectName, chapterId, chapterName, difficulty, numberOfQuestions } = await req.json();

    // Create the chapter context for the prompt
    const chapterContext = chapterId && chapterName 
      ? `from Chapter: "${chapterName}"` 
      : `covering all chapters`;

    const prompt = `Generate exactly ${numberOfQuestions} multiple choice questions for CBSE Class 10 ${subjectName} subject ${chapterContext}.

Requirements:
- Difficulty level: ${difficulty === '1' ? 'Easy' : difficulty === '2' ? 'Medium' : 'Hard'}
- Focus on CBSE Class 10 syllabus and Previous Year Questions (PYQs) pattern
${chapterId && chapterName ? `- All questions must be specifically from the chapter: "${chapterName}"` : '- Questions should cover various chapters and topics'}
- Each question should have exactly 4 options (A, B, C, D)
- Include detailed explanations for correct answers
- Mix of conceptual, application-based, and problem-solving questions
- Follow CBSE examination pattern and marking scheme

For each question, provide:
1. Clear, concise question text
2. Four distinct options
3. Correct option number (0-3)
4. Detailed step-by-step explanation
5. Whether it's based on a PYQ pattern (true/false)

Return the response as a JSON array of objects with this exact structure:
[
  {
    "question_text": "Question here...",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_option": 0,
    "explanation": "Detailed explanation...",
    "is_pyq": true
  }
]

Subject: ${subjectName}
${chapterId && chapterName ? `Chapter: ${chapterName}` : 'All Chapters'}
Generate ${numberOfQuestions} questions now:`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          maxOutputTokens: 4000,
          temperature: 0.7
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    let generatedQuestions;
    
    try {
      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid response format from Gemini API');
      }

      const content = data.candidates[0].content.parts[0].text;
      // Clean the response to extract JSON
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      const jsonString = jsonMatch ? jsonMatch[0] : content;
      generatedQuestions = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      throw new Error('Failed to parse generated questions');
    }

    // Save questions to database
    const questionsToInsert = generatedQuestions.map((q: any) => ({
      user_id: user.id,
      question_text: q.question_text,
      options: q.options,
      correct_option: q.correct_option,
      subject_id: subjectId,
      chapter_id: chapterId || null,
      difficulty_level: parseInt(difficulty),
      explanation: q.explanation,
      is_pyq: q.is_pyq || false,
      question_type: 'mcq'
    }));

    const { data: insertedQuestions, error: insertError } = await supabase
      .from('mcq_questions')
      .insert(questionsToInsert)
      .select();

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw new Error('Failed to save questions to database');
    }

    return new Response(JSON.stringify({ 
      success: true, 
      questions: insertedQuestions 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-mcq-questions function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
