import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";

import "./globals.css";

import Navbar from "@/components/layout/navbar";
import ModalProvider from "@/components/providers/modal-providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
});

export const metadata: Metadata = {
  title: "Cinch — Your Design. Your Fit. Your Tailor.",
  description:
    "Design custom clothing with AI and get matched with expert tailors across India.",
  openGraph: {
    title: "Cinch",
    description:
      "Design custom clothing with AI and get matched with expert tailors.",
    siteName: "Cinch",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable}`}
    >
      <body className="bg-[#FAF8F5]">
        <ModalProvider>
          <Navbar />
          {children}
          <Toaster position="top-right" />
        </ModalProvider>
      </body>
    </html>
  );
}