import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Trophy, PlusCircle, Sparkles } from "lucide-react";
import { MobileNav } from "@/components/MobileNav";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tournament with Friends — eFootball Tournament Organizer" },
      { name: "description", content: "Create and manage eFootball tournaments with friends. Leagues, knockouts, and everything in between." },
      { property: "og:title", content: "Tournament with Friends" },
      { property: "og:description", content: "Create and manage eFootball tournaments with friends." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <header
        className="relative overflow-hidden px-6 pb-16 pt-14 text-primary-foreground"
        style={{ backgroundImage: "var(--gradient-hero)" }}
      >
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_30%_20%,white_0,transparent_40%)]" />
        <div className="relative mx-auto max-w-md">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            eFootball Edition
          </div>
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight">
            Tournament<br />with Friends
          </h1>
          <p className="mt-3 text-sm text-white/80">
            Organize leagues and knockouts in minutes. Bring the bragging rights home.
          </p>
        </div>
      </header>

      <main className="mx-auto -mt-8 max-w-md space-y-4 px-6">
        <Link
          to="/create"
          className="group block rounded-2xl bg-card p-5 shadow-[var(--shadow-elevated)] transition-transform active:scale-[0.98]"
        >
          <div className="flex items-center gap-4">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-xl text-primary-foreground"
              style={{ backgroundImage: "var(--gradient-pitch)" }}
            >
              <PlusCircle className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <h2 className="text-base font-semibold text-card-foreground">Create Tournament</h2>
              <p className="text-sm text-muted-foreground">Start a new league or cup</p>
            </div>
          </div>
        </Link>

        <Link
          to="/tournaments"
          className="group block rounded-2xl bg-card p-5 shadow-[var(--shadow-card)] transition-transform active:scale-[0.98]"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <Trophy className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <h2 className="text-base font-semibold text-card-foreground">My Tournaments</h2>
              <p className="text-sm text-muted-foreground">View and manage your competitions</p>
            </div>
          </div>
        </Link>
      </main>

      <MobileNav />
    </div>
  );
}
