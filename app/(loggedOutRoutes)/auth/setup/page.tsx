import { redirect } from "next/navigation";
import { hasUsers } from "@/app/_server/actions/auth/utils";
import SetupForm from "@/app/(loggedOutRoutes)/auth/setup/setup-form";

export default async function SetupPage() {
  const hasExistingUsers = await hasUsers();
  if (hasExistingUsers) {
    redirect("/auth/login");
  }

  return <SetupForm />;
}
