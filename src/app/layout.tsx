import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/common/Header";
import { UrlProvider } from '@/lib/context/UrlContext';

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
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <UrlProvider>
          <Header />
          <main className="flex flex-col flex-grow items-center justify-center text-center">
            {children}
          </main>
        </UrlProvider>
      </body>
    </html>
  );
}
