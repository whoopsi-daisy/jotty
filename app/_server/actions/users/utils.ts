"use server";

import fs from "fs/promises";
import path from "path";
import { cookies } from "next/headers";
import { readSessions } from "../session";
import { User } from "@/app/_types";
import { readJsonFile } from "../file";
import { USERS_FILE } from "@/app/_consts/files";
import { getCurrentUser } from "@/app/_server/actions/users";

export async function hasUsers(): Promise<boolean> {
  try {
    const users = await readJsonFile(USERS_FILE);
    return users.length > 0;
  } catch (error) {
    return false;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}

export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.isAdmin || false;
}

export async function getUsername(): Promise<string> {
  const user = await getCurrentUser();
  return user?.username || "";
}
