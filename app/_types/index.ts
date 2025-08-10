export interface Item {
  id: string;
  text: string;
  completed: boolean;
  order: number;
}

export interface List {
  id: string;
  title: string;
  category?: string;
  items: Item[];
  createdAt: string;
  updatedAt: string;
  owner?: string;
  isShared?: boolean;
}

export interface Checklist {
  id: string;
  title: string;
  category?: string;
  items: Item[];
  createdAt: string;
  updatedAt: string;
  owner?: string;
  isShared?: boolean;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
  owner?: string;        // NEW: Track ownership
  isShared?: boolean;    // NEW: Indicate if shared
}

export interface Category {
  name: string;
  count: number;
}

export interface Result<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface User {
  username: string;
  passwordHash: string;
  isAdmin: boolean;
  isSuperAdmin?: boolean;
}

// NEW: Sharing types
export interface SharedItem {
  id: string;
  type: 'checklist' | 'document';
  title: string;
  owner: string;
  sharedWith: string[];
  sharedAt: string;
  category?: string;
  filePath: string;
}

export interface SharingMetadata {
  checklists: Record<string, SharedItem>;
  documents: Record<string, SharedItem>;
}

export interface SharingPermissions {
  canRead: boolean;
  canWrite: boolean;
  canShare: boolean;
}

export interface EmojiDictionary {
  [key: string]: string;
}

// App mode type for navigation
export type AppMode = "checklists" | "docs";
