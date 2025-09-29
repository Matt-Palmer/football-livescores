import Header from "@/components/Layout/Header";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Livescores",
  description: "Latest football scores",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#182e41] text-white overflow-x-hidden">
        <Header />
        {children}
      </body>
    </html>
  );
}
