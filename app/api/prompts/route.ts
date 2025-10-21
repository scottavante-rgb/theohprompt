import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const prompts = [
    {
      id: 1,
      title: "Professional Email",
      description: "Write a professional email",
      prompt: "Write a professional email that is concise, polite, and includes a clear call-to-action. The tone should be formal but approachable.",
      category: "Communication"
    },
    {
      id: 2,
      title: "Creative Writing",
      description: "Generate creative content",
      prompt: "Create engaging creative content that captures the reader's attention and maintains their interest throughout.",
      category: "Writing"
    },
    {
      id: 3,
      title: "Code Review",
      description: "Review and improve code",
      prompt: "Review this code for best practices, potential bugs, performance improvements, and suggest optimizations.",
      category: "Development"
    },
    {
      id: 4,
      title: "Data Analysis",
      description: "Analyze data insights",
      prompt: "Analyze this data and provide key insights, trends, and actionable recommendations based on the findings.",
      category: "Analytics"
    }
  ]

  return NextResponse.json(prompts)
}
