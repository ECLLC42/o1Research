import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { searchPubMed } from '@/lib/utils/pubmed';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const maxDuration = 300;
export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();
    const userMessage = messages[messages.length - 1].content;

    // Extract keywords and search
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "user",
        content: `Extract 3-4 key search terms from this text, return only comma-separated terms: ${userMessage}`
      }],
      temperature: 0.2
    });

    const keywords = completion.choices[0].message.content?.split(',').map(w => w.trim()) || [];
    const articles = await searchPubMed(keywords);

    // Generate response
    const prompt = `Provide a detailed research-based response to: ${userMessage}

Available articles for reference:
${articles.map(a => `- ${a.authors[0]} et al. (${a.published}) - "${a.title}"`).join('\n')}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    });

    return new Response(response.choices[0].message.content);
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process chat' },
      { status: 500 }
    );
  }
}
