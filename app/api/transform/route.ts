import { NextRequest, NextResponse } from 'next/server';
import { transformPrompt, PromptMode } from '@/lib/openai';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { savePromptHistory } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { prompt, mode, tone, remix } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Invalid prompt' },
        { status: 400 }
      );
    }

    if (!mode || !['auto', 'expert'].includes(mode)) {
      return NextResponse.json(
        { error: 'Invalid mode' },
        { status: 400 }
      );
    }

    const validTones = ['professional', 'playful', 'technical', 'poetic', 'witty', 'dry', 'harsh', 'brutal'];
    const selectedTone = tone && validTones.includes(tone) ? tone : 'professional';
    const isRemix = remix === true;

    const transformedPrompt = await transformPrompt(
      prompt,
      mode as PromptMode,
      selectedTone,
      isRemix
    );

    // Save to history if user is logged in
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      await savePromptHistory(
        session.user.email,
        prompt,
        transformedPrompt,
        mode,
        selectedTone
      );
    }

    return NextResponse.json({
      transformedPrompt: transformedPrompt,
      mode: mode,
      tone: selectedTone,
    });
  } catch (error: any) {
    console.error('Transform error:', error);

    // Provide more specific error messages
    let errorMessage = 'Failed to transform prompt';

    if (error?.message?.includes('API key')) {
      errorMessage = 'OpenAI API key not configured';
    } else if (error?.status === 401) {
      errorMessage = 'Invalid OpenAI API key';
    } else if (error?.status === 429) {
      errorMessage = 'Rate limit exceeded. Please try again later.';
    } else if (error?.message) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
