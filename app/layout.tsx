import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/_styles/globals.css";
import { ThemeProvider } from "@/app/_providers/theme-provider";
import { ChecklistProvider } from "@/app/_providers/checklist-provider";

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
          <ChecklistProvider>
            <div className="min-h-screen bg-background text-foreground transition-colors">
              {children}
            </div>
          </ChecklistProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
