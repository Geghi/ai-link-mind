import type { Metadata } from "next";
import { Header } from "@/components/common/Header";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
export const metadata: Metadata = {
  title: "LinkMind AI",
  description: "AI-powered web scraping and knowledge base",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="flex flex-col h-screen bg-background text-foreground">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-background via-background/80 to-black/70 -z-10" />
        <Header />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
