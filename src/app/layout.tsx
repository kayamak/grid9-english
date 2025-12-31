import type { Metadata } from "next";
import { DotGothic16, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const dotGothic = DotGothic16({
  weight: "400",
  variable: "--font-dot-gothic",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GRID9 ENGLISH - DRAGON QUEST STYLE",
  description: "Master English patterns with RPG style",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dotGothic.variable} ${geistSans.variable} ${geistMono.variable} font-dot`}>
        {children}
      </body>
    </html>
  );
}
