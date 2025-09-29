import Link from "next/link";

function Header() {
  return (
    <div className="bg-[#EFEF3E] px-4 py-2 mb-7">
      <h2 className="text-3xl md:text-5xl text-black">
        <Link href="/">Livescores</Link>
      </h2>
    </div>
  );
}

export default Header;
