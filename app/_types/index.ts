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
}

export interface Checklist {
  id: string;
  title: string;
  category?: string;
  items: Item[];
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
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

export interface EmojiDictionary {
  [key: string]: string;
}

// App mode type for navigation
export type AppMode = "checklists" | "docs";
