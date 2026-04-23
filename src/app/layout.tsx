import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Inter font import kiya
import "./globals.css";

// Inter font setup
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "FocusFlow | Task Manager",
  description: "A professional and minimal task management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
