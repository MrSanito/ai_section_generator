import { NextRequest, NextResponse } from 'next/server';
import { saveSectionRecord } from '@/lib/storage';
import { countNodes } from '@/lib/treeUtils';
import { SaveResponseBody, ChatSectionItem, UIElementNode } from '@/types/section';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const layout = body?.layout;
    const prompt = body?.prompt;

    if (!layout) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing layout in request body.',
        },
        { status: 400 }
      );
    }

    let nodeCount = 0;
    if (Array.isArray(layout)) {
      // Multi-section array
      nodeCount = layout.reduce((acc: number, item: any) => {
        if (item.layoutTree) {
          return acc + countNodes(item.layoutTree);
        } else if (item.type && item.id) {
          return acc + countNodes(item as UIElementNode);
        }
        return acc;
      }, 0);
    } else if (layout.id && layout.type) {
      nodeCount = countNodes(layout as UIElementNode);
    }

    const savedRecord = await saveSectionRecord(layout, prompt);

    const response: SaveResponseBody = {
      success: true,
      message: `Sections saved successfully (Version ${savedRecord.version})!`,
      savedAt: savedRecord.savedAt,
      nodeCount,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error saving layout:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to save section.',
      },
      { status: 500 }
    );
  }
}
