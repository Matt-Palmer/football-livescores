import { Oswald, Inter } from "next/font/google";

import Header from "@/components/Layout/Header";
import FavouritesContextProvider from "@/components/Shared/FavouritesContextProvider";
import SelectedFixtureContextProvider from "@/components/Shared/SelectedFixtureContextProvider";
import FixtureOverlay from "@/components/Shared/FixtureOverlay";
import "./globals.css";
import type { Metadata } from "next";

const displayFont = Oswald({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

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
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body className="bg-brand-bg text-brand-text font-sans flex flex-col h-screen overflow-hidden">
        <FavouritesContextProvider>
          <SelectedFixtureContextProvider>
            <Header />
            {/*
              Header is a flex sibling, not an overlay, so it can never be
              covered — everything else lives in this scrolling region below
              it. The split-view overlay is `absolute inset-0` inside this
              same relatively-positioned region, which is what guarantees it
              lines up exactly below the header with no gap or overlap,
              without measuring anything.
            */}
            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
              {children}
              <FixtureOverlay />
            </div>
          </SelectedFixtureContextProvider>
        </FavouritesContextProvider>
      </body>
    </html>
  );
}
