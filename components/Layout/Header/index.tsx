import Link from "next/link";
import { StarIcon } from "@heroicons/react/24/outline";

import SearchBar from "./SearchBar";

function Header() {
  return (
    <div className="shrink-0 border-b border-brand-border bg-brand-surface px-4 md:px-6 py-3 mb-7">
      <div className="flex items-center justify-between gap-4 max-w-[1600px] mx-auto">
        <Link href="/" className="flex items-baseline gap-2 shrink-0">
          <span className="font-display text-xl md:text-2xl tracking-wide text-brand-gold uppercase">
            Livescores
          </span>
        </Link>

        <div className="hidden sm:flex flex-1 justify-center">
          <SearchBar />
        </div>

        <Link
          href="/Favourites"
          className="flex items-center gap-1.5 text-sm text-brand-text hover:text-brand-gold shrink-0"
        >
          <StarIcon className="w-4 h-4" />
          <span className="hidden md:inline">Favourites</span>
        </Link>
      </div>

      <div className="sm:hidden mt-3">
        <SearchBar />
      </div>
    </div>
  );
}

export default Header;
