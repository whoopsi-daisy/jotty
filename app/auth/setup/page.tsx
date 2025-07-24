import { redirect } from 'next/navigation'
import { hasUsers } from '@/server/actions/auth/utils'
import SetupForm from '@/app/auth/setup/setup-form'

export default async function SetupPage() {
  // Redirect to login if users already exist
  const hasExistingUsers = await hasUsers()
  if (hasExistingUsers) {
    redirect('/auth/login')
  }

  return <SetupForm />
} 