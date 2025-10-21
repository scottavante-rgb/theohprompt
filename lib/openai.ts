import OpenAI from 'openai';

export type PromptMode = 'auto' | 'expert';
export type Tone = 'professional' | 'playful' | 'technical' | 'poetic' | 'witty' | 'dry' | 'harsh' | 'brutal';

const toneModifiers: Record<Tone, string> = {
  professional: "CRITICAL: Adjust the entire rewritten prompt to use clear, direct, and structured language with a professional and business-appropriate tone throughout.",
  playful: "CRITICAL: Adjust the entire rewritten prompt to use light, witty phrasing. Make it engaging and fun while staying clear and useful.",
  technical: "CRITICAL: Adjust the entire rewritten prompt to use precise, domain-rich vocabulary with technical terminology where appropriate.",
  poetic: "CRITICAL: Adjust the entire rewritten prompt to use lyrical, figurative phrasing that's creative and expressive while maintaining clarity.",
  witty: "CRITICAL: Adjust the entire rewritten prompt to use sharp, clever phrasing with intelligent humor. Make it entertaining while staying insightful and smart.",
  dry: "CRITICAL: Adjust the entire rewritten prompt to use deadpan, matter-of-fact delivery with subtle humor. Keep it understated and ironic.",
  harsh: "CRITICAL: Adjust the entire rewritten prompt to use blunt, no-nonsense language. Be direct and uncompromising. Cut through the fluff.",
  brutal: "CRITICAL: Adjust the entire rewritten prompt to use ruthlessly honest, unfiltered language. Don't sugarcoat anything. Be unapologetically blunt.",
};

export const systemPrompts: Record<Exclude<PromptMode, 'auto'>, string> = {
  expert: "Rewrite this prompt for expert-level AI prompting. Include detailed role assignment, step-by-step reasoning structure, constraints, and evaluation criteria. Format output in Markdown for clarity when appropriate.",
};

export function detectMode(prompt: string): Exclude<PromptMode, 'auto'> {
  // Auto mode always returns expert now since we only have auto and expert
  return 'expert';
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
