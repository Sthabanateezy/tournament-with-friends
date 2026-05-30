import { Link } from "@tanstack/react-router";
import { Home, Trophy, PlusCircle } from "lucide-react";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/create", label: "Create", icon: PlusCircle },
  { to: "/tournaments", label: "My", icon: Trophy },
] as const;

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <ul className="mx-auto flex max-w-md items-center justify-around px-4 py-2">
        {items.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <Link
              to={to}
              activeOptions={{ exact: true }}
              className="flex flex-col items-center gap-1 rounded-lg px-4 py-2 text-xs text-muted-foreground transition-colors data-[status=active]:text-primary"
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}