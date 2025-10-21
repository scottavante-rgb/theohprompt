import OpenAI from 'openai';

export type PromptMode = 'auto' | 'easy' | 'normal' | 'expert';
export type Tone = 'professional' | 'playful' | 'technical' | 'poetic' | 'witty' | 'dry' | 'harsh' | 'brutal';

const toneModifiers: Record<Tone, string> = {
  professional: "Use clear, direct, and structured language. Maintain a professional and business-appropriate tone.",
  playful: "Use light, witty phrasing. Make it engaging and fun while staying clear and useful.",
  technical: "Use precise, domain-rich vocabulary. Include technical terminology where appropriate.",
  poetic: "Use lyrical, figurative phrasing. Make it creative and expressive while maintaining clarity.",
  witty: "Use sharp, clever phrasing with intelligent humor. Be entertaining while staying insightful and smart.",
  dry: "Use deadpan, matter-of-fact delivery with subtle humor. Keep it understated and ironic.",
  harsh: "Use blunt, no-nonsense language. Be direct and uncompromising. Cut through the fluff.",
  brutal: "Use ruthlessly honest, unfiltered language. Don't sugarcoat anything. Be unapologetically blunt.",
};

export const systemPrompts: Record<Exclude<PromptMode, 'auto'>, string> = {
  easy: "Rewrite this prompt simply and conversationally. Maintain the user's tone but make it clear, short, and friendly. Avoid jargon or excessive structure.",
  normal: "Rewrite this prompt with clarity, structure, and tone suitable for ChatGPT or Claude. Include role, task, context, and output format where appropriate while keeping it concise and useful.",
  expert: "Rewrite this prompt for expert-level AI prompting. Include detailed role assignment, step-by-step reasoning structure, constraints, and evaluation criteria. Format output in Markdown for clarity.",
};

export function detectMode(prompt: string): Exclude<PromptMode, 'auto'> {
  const wordCount = prompt.trim().split(/\s+/).length;
  const lowerPrompt = prompt.toLowerCase();

  if (wordCount < 12) {
    return 'easy';
  }

  const expertKeywords = ['act as', 'generate', 'analyse', 'analyze', 'compare', 'evaluate', 'step by step'];
  if (expertKeywords.some(keyword => lowerPrompt.includes(keyword))) {
    return 'expert';
  }

  const normalKeywords = ['write', 'make', 'explain', 'create', 'describe'];
  if (normalKeywords.some(keyword => lowerPrompt.includes(keyword))) {
    return 'normal';
  }

  return 'normal';
}

export async function transformPrompt(
  prompt: string,
  mode: PromptMode,
  tone: Tone = 'professional',
  remix: boolean = false
): Promise<string> {
  // Validate API key first
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.includes('your_openai_api_key')) {
    throw new Error('OpenAI API key not configured properly');
  }

  const selectedMode = mode === 'auto' ? detectMode(prompt) : mode;
  const baseSystemPrompt = systemPrompts[selectedMode];
  const toneModifier = toneModifiers[tone];

  let systemPrompt = `${baseSystemPrompt}\n\nTone: ${toneModifier}`;

  if (remix) {
    systemPrompt += '\n\nIMPORTANT: Generate a fresh variation with different phrasing, structure, or examples while maintaining the same quality level and intent.';
  }

  const openai = new OpenAI({
    apiKey: apiKey,
  });

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      temperature: remix ? 0.9 : 0.7,
      max_tokens: 1000,
    });

    return completion.choices[0]?.message?.content || prompt;
  } catch (error: any) {
    if (error?.status === 401) {
      throw new Error('Invalid OpenAI API key');
    }
    throw new Error(error?.message || 'Failed to communicate with OpenAI API');
  }
}
