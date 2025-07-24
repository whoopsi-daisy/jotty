import { redirect } from 'next/navigation'
import { hasUsers } from '@/app/_server/actions/auth/utils'
import SetupForm from '@/app/(loggedOutRoutes)/auth/setup/setup-form'

export default async function SetupPage() {
  // Redirect to login if users already exist
  const hasExistingUsers = await hasUsers()
  if (hasExistingUsers) {
    redirect('/auth/login')
  }

  return <SetupForm />
} 