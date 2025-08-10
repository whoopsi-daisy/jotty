import { APP_CONSTANTS } from "./constants";

export const validateTitle = (title: string): string | null => {
  if (!title.trim()) {
    return "Title is required";
  }
  if (title.length > APP_CONSTANTS.MAX_TITLE_LENGTH) {
    return `Title must be ${APP_CONSTANTS.MAX_TITLE_LENGTH} characters or less`;
  }
  return null;
};

export const validateContent = (content: string): string | null => {
  if (content.length > APP_CONSTANTS.MAX_CONTENT_LENGTH) {
    return `Content must be ${APP_CONSTANTS.MAX_CONTENT_LENGTH} characters or less`;
  }
  return null;
};

export const validateCategory = (category: string): string | null => {
  if (!category.trim()) {
    return "Category is required";
  }
  if (category.length > 50) {
    return "Category must be 50 characters or less";
  }
  return null;
};

export const validateUsername = (username: string): string | null => {
  if (!username.trim()) {
    return "Username is required";
  }
  if (username.length < 3) {
    return "Username must be at least 3 characters";
  }
  if (username.length > 20) {
    return "Username must be 20 characters or less";
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return "Username can only contain letters, numbers, underscores, and hyphens";
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) {
    return "Password is required";
  }
  if (password.length < 6) {
    return "Password must be at least 6 characters";
  }
  return null;
};
