import { NextResponse } from 'next/server';
import { getSavedSectionRecord } from '@/lib/storage';

export async function GET() {
  try {
    const record = await getSavedSectionRecord();
    if (!record) {
      return NextResponse.json({
        success: false,
        data: null,
        message: 'No saved section found yet.',
      });
    }

    return NextResponse.json({
      success: true,
      data: record.layout,
      prompt: record.prompt,
      savedAt: record.savedAt,
      version: record.version,
    });
  } catch (error: any) {
    console.error('Error fetching saved section:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch saved section.',
      },
      { status: 500 }
    );
  }
}
