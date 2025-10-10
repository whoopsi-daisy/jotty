import { redirect } from "next/navigation";
import { hasUsers } from "@/app/_server/actions/users";
import LoginForm from "@/app/(loggedOutRoutes)/auth/login/login-form";
import { AuthShell } from "@/app/_components/GlobalComponents/Auth/AuthShell";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const ssoEnabled = process.env.SSO_MODE === "oidc";
  const allowLocal = process.env.SSO_FALLBACK_LOCAL && process.env.SSO_FALLBACK_LOCAL !== "no";

  const hasExistingUsers = await hasUsers();
  if (
    (!hasExistingUsers && ssoEnabled && allowLocal) ||
    (!hasExistingUsers && !ssoEnabled)
  ) {
    redirect("/auth/setup");
  }

  if (ssoEnabled && !allowLocal) {
    return (
      <AuthShell>
        <div className="space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Sign in
            </h1>
          </div>
          <a
            className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
            href="/api/oidc/login"
          >
            Sign in with SSO
          </a>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <div className="space-y-6">
        {ssoEnabled && (
          <div className="space-y-3">
            <a
              className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
              href="/api/oidc/login"
            >
              Sign in with SSO
            </a>
            <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
              <span>or continue with local account</span>
            </div>
          </div>
        )}
        <LoginForm />
      </div>
    </AuthShell>
  );
}
