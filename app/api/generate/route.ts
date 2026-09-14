import { NextRequest, NextResponse } from 'next/server';
import { matchLayoutFromPrompt } from '@/data/templates';
import { cloneTreeWithNewIds } from '@/lib/treeUtils';
import { GenerateResponseBody } from '@/types/section';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt: string = body?.prompt || '';

    if (!prompt.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Prompt cannot be empty. Please enter a prompt like "A pricing section with 3 tiers".',
        },
        { status: 400 }
      );
    }

    // Mock AI keyword matching logic
    const { layoutType, matchedKeyword, template } = matchLayoutFromPrompt(prompt);

    // Deep-clone and assign fresh unique IDs
    const clonedLayout = cloneTreeWithNewIds(template, `${layoutType}-${Date.now().toString(36)}`);

    const response: GenerateResponseBody = {
      success: true,
      layoutType,
      matchedKeyword,
      data: clonedLayout,
      message: `Generated ${layoutType.toUpperCase()} section based on keyword "${matchedKeyword}".`,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error generating section:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error while generating section.',
      },
      { status: 500 }
    );
  }
}
