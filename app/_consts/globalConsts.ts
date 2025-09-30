export enum Modes {
  CHECKLISTS = "checklists",
  NOTES = "notes",
  DEPRECATED_DOCS = "docs",
}

export enum ChecklistsTypes {
  SIMPLE = "simple",
  TASK = "task",
}

export enum TaskStatus {
  TODO = "todo",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  PAUSED = "paused",
}

export const CHECKLISTS_FOLDER = Modes.CHECKLISTS;
export const NOTES_FOLDER = Modes.NOTES;
export const DEPRECATED_DOCS_FOLDER = Modes.DEPRECATED_DOCS;
