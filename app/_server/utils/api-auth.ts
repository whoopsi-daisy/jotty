import { readJsonFile } from "@/app/_server/actions/file";
import { USERS_FILE } from "@/app/_consts/files";
import { User } from "@/app/_types";

export const authenticateApiKey = async (
  apiKey: string
): Promise<User | null> => {
  try {
    if (!apiKey) {
      return null;
    }

    const users = await readJsonFile(USERS_FILE);
    const user = users.find((u: User) => u.apiKey === apiKey);

    return user || null;
  } catch (error) {
    console.error("Error authenticating API key:", error);
    return null;
  }
};

export const generateApiKey = (): string => {
  const prefix = "ck_";
  const randomBytes = Array.from({ length: 32 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("");
  return prefix + randomBytes;
};
