import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Only create client if valid credentials are provided
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http')
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export interface Prompt {
  id: string;
  userId: string;
  title: string;
  content: string;
  mode: string;
  tone?: string;
  createdAt: string;
}

export interface PromptHistory {
  id: string;
  userId: string;
  input: string;
  output: string;
  mode: string;
  tone: string;
  createdAt: string;
}

export async function savePrompt(
  userId: string,
  content: string,
  mode: string,
  tone?: string,
  title?: string
): Promise<{ data: Prompt | null; error: any }> {
  if (!supabase) {
    return {
      data: null,
      error: new Error('Supabase is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file.')
    };
  }

  const defaultTitle = content.substring(0, 50) + (content.length > 50 ? '...' : '');
  const finalTitle = title || defaultTitle;

  const { data, error } = await supabase
    .from('prompts')
    .insert({
      userId,
      title: finalTitle,
      content,
      mode,
      tone: tone || 'professional',
      createdAt: new Date().toISOString(),
    })
    .select()
    .single();

  return { data, error };
}

export async function getUserPrompts(userId: string): Promise<{ data: Prompt[] | null; error: any }> {
  if (!supabase) {
    return {
      data: null,
      error: new Error('Supabase is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file.')
    };
  }

  const { data, error } = await supabase
    .from('prompts')
    .select('*')
    .eq('userId', userId)
    .order('createdAt', { ascending: false });

  return { data, error };
}

export async function deletePrompt(promptId: string): Promise<{ error: any }> {
  if (!supabase) {
    return {
      error: new Error('Supabase is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file.')
    };
  }

  const { error } = await supabase
    .from('prompts')
    .delete()
    .eq('id', promptId);

  return { error };
}

export async function savePromptHistory(
  userId: string,
  input: string,
  output: string,
  mode: string,
  tone: string
): Promise<{ error: any }> {
  if (!supabase) {
    return {
      error: new Error('Supabase is not configured.')
    };
  }

  const { error } = await supabase
    .from('prompt_history')
    .insert({
      userId,
      input,
      output,
      mode,
      tone,
      createdAt: new Date().toISOString(),
    });

  return { error };
}

export async function getUserHistory(userId: string): Promise<{ data: PromptHistory[] | null; error: any }> {
  if (!supabase) {
    return {
      data: null,
      error: new Error('Supabase is not configured.')
    };
  }

  const { data, error } = await supabase
    .from('prompt_history')
    .select('*')
    .eq('userId', userId)
    .order('createdAt', { ascending: false })
    .limit(50);

  return { data, error };
}

export async function clearUserHistory(userId: string): Promise<{ error: any }> {
  if (!supabase) {
    return {
      error: new Error('Supabase is not configured.')
    };
  }

  const { error } = await supabase
    .from('prompt_history')
    .delete()
    .eq('userId', userId);

  return { error };
}
