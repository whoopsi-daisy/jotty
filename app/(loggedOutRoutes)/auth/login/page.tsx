import { redirect } from "next/navigation";
import { hasUsers } from "@/app/_server/actions/auth/utils";
import LoginForm from "@/app/(loggedOutRoutes)/auth/login/login-form";

export default async function LoginPage() {
  const hasExistingUsers = await hasUsers();
  if (!hasExistingUsers) {
    redirect("/auth/setup");
  }

  return <LoginForm />;
}
