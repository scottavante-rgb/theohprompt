# OhPrompt!

> Lazy prompt? Let's fix that.

A witty, beautifully designed AI tool that transforms lazy prompts into powerful, structured ones ready for ChatGPT, Claude, or Gemini.

## Features

- **4 Intelligence Modes**: Auto, Easy, Normal, and Expert modes for different prompt complexity needs
- **AI-Powered Transformation**: Uses GPT-4 Turbo to enhance your prompts
- **Multi-Model Support**: Open improved prompts directly in ChatGPT, Claude, or Gemini
- **Save & Manage**: Sign in with Google or GitHub to save your favorite prompts
- **Beautiful UI**: Teenage Engineering-inspired minimalist design with JetBrains Mono font
- **Smart Auto-Detection**: Automatically selects the best mode based on your input

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + Shadcn/UI
- **Authentication**: NextAuth.js (Google + GitHub)
- **Database**: Supabase
- **AI**: OpenAI GPT-4 Turbo
- **Notifications**: Sonner

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy the `.env.local` file and fill in your credentials:

```env
# OpenAI
OPENAI_API_KEY=your_openai_api_key_here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# NextAuth
NEXTAUTH_URL=http://localhost:3010
NEXTAUTH_SECRET=your_nextauth_secret_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
```

#### Getting API Keys:

- **OpenAI**: Get your API key from [platform.openai.com](https://platform.openai.com/api-keys)
- **Supabase**: Create a project at [supabase.com](https://supabase.com)
- **Google OAuth**: Set up at [console.cloud.google.com](https://console.cloud.google.com)
- **GitHub OAuth**: Create an app at [github.com/settings/developers](https://github.com/settings/developers)
- **NextAuth Secret**: Generate with `openssl rand -base64 32`

### 3. Set Up Supabase Tables

Create these tables in your Supabase project:

```sql
-- Users table (optional, NextAuth can handle this)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Prompts table
CREATE TABLE prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  userId TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  mode TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW()
);

-- Add index for better performance
CREATE INDEX idx_prompts_userId ON prompts(userId);
CREATE INDEX idx_prompts_createdAt ON prompts(createdAt DESC);
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3010](http://localhost:3010) in your browser.

## How It Works

### Prompt Modes

#### 🟠 Auto Mode
Analyzes your prompt and automatically selects the best mode:
- < 12 words → Easy
- Contains "write", "make", "explain" → Normal
- Contains "act as", "analyse", "compare" → Expert

#### ⚪ Easy Mode
Keep it chill. Simple, conversational rewrites that maintain your tone.

#### ⚪ Normal Mode
Balanced and smart. Adds structure with role, task, context, and output format.

#### ⚪ Expert Mode
Go full nerd. Detailed role assignment, step-by-step reasoning, constraints, and evaluation criteria.

## Project Structure

```
/app
  /api
    /auth/[...nextauth]  - NextAuth API routes
    /transform           - Prompt transformation endpoint
  layout.tsx             - Root layout with providers
  page.tsx               - Main application page
  globals.css            - Global styles & design system

/components
  ModeSelector.tsx       - Mode selection component
  Providers.tsx          - SessionProvider & Toaster wrapper
  /ui                    - Shadcn/UI components

/lib
  openai.ts              - OpenAI client & transformation logic
  supabase.ts            - Supabase client & database helpers
  auth.ts                - NextAuth configuration
  utils.ts               - Utility functions

/types
  next-auth.d.ts         - NextAuth type extensions
```

## Design System

- **Background**: #FAF8F3 (soft cream)
- **Accent**: #FF6E00 (orange)
- **Font**: JetBrains Mono
- **Style**: Teenage Engineering minimalism
- **Animations**: Subtle sparkle glow on the header

## License

MIT

---

Made with ✨ by humans and AI.

