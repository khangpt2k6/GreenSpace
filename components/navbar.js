"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import { MdEco } from "react-icons/md";

const NAV_LINKS = [
  { href: "/",            label: "Home" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/community",   label: "Community" },
  { href: "/guide",       label: "Guide" },
  { href: "/analyze",     label: "Analyze" },
  { href: "/survey",      label: "Survey" },
];

/**
 * Shared navbar used on every page.
 * Pass an optional `action` node for page-specific buttons (e.g. "List Product").
 */
export default function Navbar({ action }) {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();

  return (
    <header className="globalNav">
      <Link href="/" className="globalNavBrand">
        <MdEco size={20} />
        GreenCart
      </Link>

      <nav className="globalNavLinks">
        {NAV_LINKS.map(({ href, label }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`globalNavLink${active ? " globalNavLink--active" : ""}`}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="globalNavRight">
        {action && <div className="globalNavAction">{action}</div>}
        {isLoaded && (
          user ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <SignInButton mode="modal">
              <button className="globalNavSignIn">Sign in</button>
            </SignInButton>
          )
        )}
      </div>
    </header>
  );
}
