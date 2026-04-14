"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import { MdEco } from "react-icons/md";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "@/components/theme-provider";

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
  const { theme, setTheme } = useTheme();

  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }

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

        {/* Theme toggle */}
        <button
          className="globalNavThemeBtn"
          onClick={toggleTheme}
          title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <FiSun size={16} /> : <FiMoon size={16} />}
        </button>

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
