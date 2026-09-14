import fs from 'fs';
import path from 'path';
import { UIElementNode, ChatSectionItem } from '@/types/section';

export interface SavedRecord {
  layout: UIElementNode | ChatSectionItem[] | any;
  prompt?: string;
  savedAt: string;
  version: number;
}

// In-memory mock database store
let inMemoryStore: SavedRecord | null = null;

const STORAGE_FILE_PATH = path.join(process.cwd(), 'data', 'saved-section.json');

/**
 * Saves layout to in-memory store and persists to disk.
 */
export async function saveSectionRecord(layout: UIElementNode | ChatSectionItem[] | any, prompt?: string): Promise<SavedRecord> {
  const record: SavedRecord = {
    layout,
    prompt,
    savedAt: new Date().toISOString(),
    version: (inMemoryStore?.version || 0) + 1,
  };

  inMemoryStore = record;

  try {
    const dir = path.dirname(STORAGE_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(STORAGE_FILE_PATH, JSON.stringify(record, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not persist to file system, using in-memory store only:', err);
  }

  return record;
}

/**
 * Retrieves the latest saved layout.
 */
export async function getSavedSectionRecord(): Promise<SavedRecord | null> {
  if (inMemoryStore) {
    return inMemoryStore;
  }

  try {
    if (fs.existsSync(STORAGE_FILE_PATH)) {
      const content = fs.readFileSync(STORAGE_FILE_PATH, 'utf-8');
      const parsed: SavedRecord = JSON.parse(content);
      inMemoryStore = parsed;
      return parsed;
    }
  } catch (err) {
    console.warn('Could not read saved section from file system:', err);
  }

  return null;
}
