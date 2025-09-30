import { redirect } from "next/navigation";
import { hasUsers } from "@/app/_server/actions/auth/utils";
import SetupForm from "@/app/(loggedOutRoutes)/auth/setup/setup-form";
import { AuthShell } from "@/app/_components/GlobalComponents/Auth/AuthShell";

export const dynamic = "force-dynamic";

export default async function SetupPage() {
  const hasExistingUsers = await hasUsers();
  if (hasExistingUsers) {
    redirect("/auth/login");
  }

  return (
    <AuthShell>
      <SetupForm />
    </AuthShell>
  );
}
