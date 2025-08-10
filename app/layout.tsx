import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/_styles/globals.css";
import { ThemeProvider } from "@/app/_providers/ThemeProvider";
import { ChecklistProvider } from "@/app/_providers/ChecklistProvider";
import { AppModeProvider } from "@/app/_providers/AppModeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Checklist App",
  description: "A simple checklist app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AppModeProvider>
            <ChecklistProvider>
              <div className="min-h-screen bg-background text-foreground transition-colors">
                {children}
              </div>
            </ChecklistProvider>
          </AppModeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
