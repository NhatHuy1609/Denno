import React from "react";
import Link from "next/link";

function LandingHeader() {
  const links = [
    { title: "Features", href: "#" },
    { title: "Pricing", href: "#" },
    { title: "Templates", href: "#" },
  ];

  return (
    <header className="flex w-full justify-between bg-white px-10 py-3">
      <div className="flex items-center">
        <Link href="/">
          <div className="mr-20">
            <p className="text-black">Denno</p>
          </div>
        </Link>
        <ul className="flex list-none items-center gap-10">
          {links.map((link) => (
            <Link href={link.href} className="font-medium hover:text-blue-500">
              {link.title}
            </Link>
          ))}
        </ul>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/sign-in"
          className="rounded-md p-3 text-sm font-medium text-blue-500 hover:bg-stone-100"
        >
          Sign in
        </Link>
      </div>
    </header>
  );
}

export default LandingHeader;
