import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "MeshForge v2 - Agent Economy OS",
  description: "MeshForge is the OS for autonomous agents. Discover, negotiate, and transact with zero trust in emerging markets.",
};

import '@rainbow-me/rainbowkit/styles.css';
import { Providers } from "./providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Satoshi:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased text-brand-dark bg-white overflow-x-hidden selection:bg-brand-primary selection:text-brand-dark`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
