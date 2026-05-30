import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Trophy, Users, PlusCircle } from "lucide-react";
import { MobileNav } from "@/components/MobileNav";
import { useTournaments } from "@/lib/tournaments";

export const Route = createFileRoute("/tournaments")({
  head: () => ({
    meta: [
      { title: "My Tournaments — Tournament with Friends" },
      { name: "description", content: "Browse your active and past eFootball tournaments." },
    ],
  }),
  component: TournamentsPage,
});

function TournamentsPage() {
  const tournaments = useTournaments();

  return (
    <div className="min-h-screen bg-background pb-28">
      <header
        className="px-6 pb-10 pt-12 text-primary-foreground"
        style={{ backgroundImage: "var(--gradient-hero)" }}
      >
        <div className="mx-auto max-w-md">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-white/80">
            <ChevronLeft className="h-4 w-4" /> Back
          </Link>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">My Tournaments</h1>
          <p className="mt-1 text-sm text-white/80">
            {tournaments.length
              ? `${tournaments.length} active competition${tournaments.length === 1 ? "" : "s"}`
              : "Nothing here yet"}
          </p>
        </div>
      </header>

      <main className="mx-auto -mt-6 max-w-md space-y-3 px-6">
        {tournaments.length === 0 ? (
          <div className="rounded-2xl bg-card p-8 text-center shadow-[var(--shadow-card)]">
            <div
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl text-primary-foreground"
              style={{ backgroundImage: "var(--gradient-pitch)" }}
            >
              <Trophy className="h-7 w-7" />
            </div>
            <h2 className="mt-4 text-base font-semibold text-card-foreground">No tournaments yet</h2>
            <p className="mt-1 text-sm text-muted-foreground">Create your first tournament to get started.</p>
            <Link
              to="/create"
              className="mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-primary-foreground"
              style={{ backgroundImage: "var(--gradient-pitch)" }}
            >
              <PlusCircle className="h-4 w-4" /> Create Tournament
            </Link>
          </div>
        ) : (
          tournaments.map((t) => (
            <Link
              key={t.id}
              to="/tournaments/$id"
              params={{ id: t.id }}
              className="block rounded-2xl bg-card p-5 shadow-[var(--shadow-card)] transition-transform active:scale-[0.98]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="truncate text-base font-semibold text-card-foreground">{t.name}</h3>
                  <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Trophy className="h-3.5 w-3.5" /> {t.type}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" /> {t.players} players
                    </span>
                  </div>
                </div>
                <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-accent-foreground">
                  Active
                </span>
              </div>
            </Link>
          ))
        )}
      </main>

      <MobileNav />
    </div>
  );
}