'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createHash } from 'crypto'
import fs from 'fs/promises'
import path from 'path'

interface User {
  username: string
  passwordHash: string
  isAdmin: boolean
}

const USERS_FILE = path.join(process.cwd(), 'data', 'users', 'users.json')
const SESSIONS_FILE = path.join(process.cwd(), 'data', 'users', 'sessions.json')

// Helper to hash passwords consistently
function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex')
}

// Helper to read users file
async function readUsers(): Promise<User[]> {
  try {
    const content = await fs.readFile(USERS_FILE, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    return []
  }
}

// Helper to read sessions
async function readSessions(): Promise<Record<string, string>> {
  try {
    const content = await fs.readFile(SESSIONS_FILE, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    return {}
  }
}

// Helper to write sessions
async function writeSessions(sessions: Record<string, string>) {
  await fs.mkdir(path.dirname(SESSIONS_FILE), { recursive: true })
  await fs.writeFile(SESSIONS_FILE, JSON.stringify(sessions, null, 2))
}

export async function login(formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  if (!username || !password) {
    return { error: 'Username and password are required' }
  }

  const users = await readUsers()
  const user = users.find(u => u.username === username)

  if (!user || user.passwordHash !== hashPassword(password)) {
    return { error: 'Invalid username or password' }
  }

  // Create session
  const sessionId = createHash('sha256').update(Math.random().toString()).digest('hex')
  const sessions = await readSessions()
  sessions[sessionId] = username

  await writeSessions(sessions)

  // Set session cookie
  cookies().set('session', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  })

  redirect('/')
} 