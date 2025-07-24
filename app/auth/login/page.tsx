import { redirect } from 'next/navigation'
import { hasUsers } from '@/server/actions/auth/utils'
import LoginForm from '@/app/auth/login/login-form'

export default async function LoginPage() {
  // Redirect to setup if no users exist
  const hasExistingUsers = await hasUsers()
  if (!hasExistingUsers) {
    redirect('/auth/setup')
  }

  return <LoginForm />
} 