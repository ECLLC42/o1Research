import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { question, occupation } = await request.json();
    console.log('Optimize request:', { question, occupation });

    if (!question || !occupation) {
      return NextResponse.json(
        { error: 'Question and occupation are required' }, 
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "user",
        content: `Optimize this ${occupation}'s research question for academic search: ${question}`
      }],
      temperature: 0.7,
    });

    const optimizedQuestion = completion.choices[0].message.content;
    console.log('Optimized question:', optimizedQuestion);
    
    return NextResponse.json({ optimizedQuestion });
  } catch (error) {
    console.error('Optimize API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to optimize question' }, 
      { status: 500 }
    );
  }
} 