
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

    const { subjectId, difficulty, numberOfQuestions, subjectName, chapterId, chapterName } = await req.json();

    // Build context based on whether chapter is specified
    const contextText = chapterId && chapterName 
      ? `Focus specifically on Chapter: "${chapterName}" from ${subjectName}. Generate questions ONLY from this chapter's content, concepts, and topics.`
      : `Cover various chapters and topics from ${subjectName} subject syllabus.`;

    const prompt = `Generate exactly ${numberOfQuestions} multiple choice questions for CBSE Class 10 ${subjectName} subject.

${contextText}

Requirements:
- Difficulty level: ${difficulty === '1' ? 'Easy (Basic concepts and definitions)' : difficulty === '2' ? 'Medium (Application and understanding)' : 'Hard (Analysis and complex problem-solving)'}
- Focus on CBSE Class 10 syllabus and Previous Year Questions (PYQs) pattern
- Each question should have exactly 4 options (A, B, C, D)
- Include detailed explanations for correct answers
- Mix of conceptual, application-based, and problem-solving questions
- Follow CBSE examination pattern and marking scheme

For each question, provide:
1. Clear, concise question text
2. Four distinct options
3. Correct option number (0-3 for A-D)
4. Detailed step-by-step explanation
5. Whether it's based on a PYQ pattern (true/false)

Return the response as a JSON array of objects with this exact structure:
[
  {
    "question_text": "Question here...",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_option": 0,
    "explanation": "Detailed explanation with step-by-step solution...",
    "is_pyq": true
  }
]

${chapterId ? `Chapter Focus: ${chapterName}` : `Subject: ${subjectName}`}
Generate ${numberOfQuestions} high-quality CBSE pattern questions now:`;

    console.log('Generating questions with Gemini API...');
    
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
          temperature: 0.7,
          topP: 0.9,
          topK: 40
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    let generatedQuestions;
    
    try {
      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid response format from Gemini API');
      }

      const content = data.candidates[0].content.parts[0].text;
      console.log('Raw Gemini response:', content);
      
      // Clean the response to extract JSON
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        // If no JSON array found, try to extract from code blocks
        const codeBlockMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
        if (codeBlockMatch) {
          generatedQuestions = JSON.parse(codeBlockMatch[1]);
        } else {
          throw new Error('No valid JSON found in response');
        }
      } else {
        generatedQuestions = JSON.parse(jsonMatch[0]);
      }

      // Validate the generated questions
      if (!Array.isArray(generatedQuestions) || generatedQuestions.length === 0) {
        throw new Error('Generated questions is not a valid array');
      }

      // Validate each question structure
      for (const q of generatedQuestions) {
        if (!q.question_text || !Array.isArray(q.options) || q.options.length !== 4 || 
            typeof q.correct_option !== 'number' || q.correct_option < 0 || q.correct_option > 3) {
          throw new Error('Invalid question structure');
        }
      }

    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      console.log('Gemini response content:', data.candidates?.[0]?.content?.parts?.[0]?.text);
      throw new Error('Failed to parse generated questions: ' + parseError.message);
    }

    console.log(`Successfully generated ${generatedQuestions.length} questions`);

    // Save questions to database
    const questionsToInsert = generatedQuestions.map((q: any) => ({
      user_id: user.id,
      question_text: q.question_text,
      options: q.options,
      correct_option: q.correct_option,
      subject_id: subjectId,
      chapter_id: chapterId || null,
      difficulty_level: parseInt(difficulty),
      explanation: q.explanation || 'No explanation provided',
      is_pyq: q.is_pyq || false,
      question_type: 'mcq'
    }));

    const { data: insertedQuestions, error: insertError } = await supabase
      .from('mcq_questions')
      .insert(questionsToInsert)
      .select();

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw new Error('Failed to save questions to database: ' + insertError.message);
    }

    console.log(`Successfully saved ${insertedQuestions.length} questions to database`);

    return new Response(JSON.stringify({ 
      success: true, 
      questions: insertedQuestions,
      context: chapterId ? `Chapter: ${chapterName}` : `Subject: ${subjectName}`
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
