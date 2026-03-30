import type { Metadata } from "next";
import { GameFlowAnalytics } from "@/components/analytics/gameflow-analytics";
import "./globals.css";

export const metadata: Metadata = {
  title: "GameFlow",
  description:
    "A gaming backlog and discovery app for organizing what to play next.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="dark h-full antialiased"
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground min-h-full">
        {children}
        <GameFlowAnalytics />
      </body>
    </html>
  );
}
