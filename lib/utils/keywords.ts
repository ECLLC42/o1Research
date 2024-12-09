import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function extractKeywords(text: string): Promise<string[]> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "user",
        content: `Extract 3-4 key search terms from this text, return only comma-separated terms: ${text}`
      }],
      temperature: 0.2
    });

    const content = completion.choices[0].message.content;
    if (!content) return [];
    
    const keywords = content.split(',').map(w => w.trim());
    return keywords.slice(0, 4); // Limit to 4 keywords
  } catch (error) {
    console.error('Error extracting keywords:', error);
    throw error;
  }
} 