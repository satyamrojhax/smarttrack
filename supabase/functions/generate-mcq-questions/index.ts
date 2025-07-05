import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
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

    const { subjectId, difficulty, numberOfQuestions, subjectName } = await req.json();

    const prompt = `Generate exactly ${numberOfQuestions} multiple choice questions for CBSE Class 10 ${subjectName} subject.

Requirements:
- Difficulty level: ${difficulty === '1' ? 'Easy' : difficulty === '2' ? 'Medium' : 'Hard'}
- Focus on CBSE Class 10 syllabus and Previous Year Questions (PYQs) pattern
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
Generate ${numberOfQuestions} questions now:`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert CBSE Class 10 teacher who creates high-quality multiple choice questions. Always respond with valid JSON array format only, no additional text.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    let generatedQuestions;
    
    try {
      const content = data.choices[0].message.content;
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