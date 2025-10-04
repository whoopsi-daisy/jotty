import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "@/app/_styles/globals.css";
import { ThemeProvider } from "@/app/_providers/ThemeProvider";
import { ChecklistProvider } from "@/app/_providers/ChecklistProvider";
import { AppModeProvider } from "@/app/_providers/AppModeProvider";
import { ToastProvider } from "@/app/_providers/ToastProvider";
import { NavigationGuardProvider } from "@/app/_providers/NavigationGuardProvider";
import { InstallPrompt } from "@/app/_components/GlobalComponents/Pwa/InstallPrompt";
import { getSettings } from "@/app/_server/actions/config";
import { DynamicFavicon } from "@/app/_components/GlobalComponents/Layout/Logo/DynamicFavicon";
import { getCurrentUser } from "./_server/actions/users";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { redirectGuards } from "./_server/actions/guards";

const inter = Inter({ subsets: ["latin"] });

export const generateMetadata = async (): Promise<Metadata> => {
  const settings = await getSettings();
  const appName = settings?.appName || "rwMarkable";
  const appDescription =
    settings?.appDescription ||
    "A simple, fast, and lightweight checklist and notes application";
  const app16x16Icon =
    settings?.["16x16Icon"] || "/app-icons/favicon-16x16.png";
  const app32x32Icon =
    settings?.["32x32Icon"] || "/app-icons/favicon-32x32.png";
  const app180x180Icon =
    settings?.["180x180Icon"] || "/app-icons/apple-touch-icon.png";

  return {
    title: appName,
    description: appDescription,
    manifest: "/app-icons/site.webmanifest",
    icons: {
      icon: [
        {
          url: app16x16Icon,
          sizes: "16x16",
          type: "image/png",
        },
        {
          url: app32x32Icon,
          sizes: "32x32",
          type: "image/png",
        },
      ],
      apple: [
        {
          url: app180x180Icon,
          sizes: "180x180",
          type: "image/png",
        },
      ],
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: appName,
    },
  };
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#000000",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  const appName = settings.appName || "rwMarkable";

  redirectGuards();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/app-icons/favicon.ico" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={appName} />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <AppModeProvider>
            <ChecklistProvider>
              <NavigationGuardProvider>
                <ToastProvider>
                  <div className="min-h-screen bg-background text-foreground transition-colors">
                    <DynamicFavicon />
                    {children}
                    <InstallPrompt />
                  </div>
                </ToastProvider>
              </NavigationGuardProvider>
            </ChecklistProvider>
          </AppModeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
