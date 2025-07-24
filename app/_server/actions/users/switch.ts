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

// Get current user from session
async function getCurrentUser(): Promise<User | null> {
  const sessionId = cookies().get('session')?.value
  if (!sessionId) return null

  const users = await readUsers()
  const sessions = await readSessions()
  const username = sessions[sessionId]
  
  return users.find(u => u.username === username) || null
}

export async function switchUser(formData: FormData) {
  const currentUser = await getCurrentUser()
  if (!currentUser?.isAdmin) {
    return { error: 'Unauthorized' }
  }

  const targetUsername = formData.get('username') as string
  if (!targetUsername) {
    return { error: 'Username is required' }
  }

  const users = await readUsers()
  const targetUser = users.find(u => u.username === targetUsername)
  
  if (!targetUser) {
    return { error: 'User not found' }
  }

  // Create new session for target user
  const sessionId = createHash('sha256').update(Math.random().toString()).digest('hex')
  const sessions = await readSessions()
  sessions[sessionId] = targetUsername

  await writeSessions(sessions)

  // Set session cookie
  cookies().set('session', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  })

  return { success: true }
} 