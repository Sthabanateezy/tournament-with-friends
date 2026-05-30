import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Trophy, Users, Calendar, Shield } from "lucide-react";
import { useState } from "react";
import { MobileNav } from "@/components/MobileNav";
import {
  useTournament,
  getParticipants,
  getStandings,
  getUpcomingMatches,
  getBracket,
} from "@/lib/tournaments";

export const Route = createFileRoute("/tournaments/$id")({
  head: () => ({
    meta: [
      { title: "Tournament — Tournament with Friends" },
      { name: "description", content: "Tournament details, standings, bracket, and upcoming matches." },
    ],
  }),
  component: TournamentDetails,
});

type Tab = "overview" | "standings" | "matches";

function TournamentDetails() {
  const { id } = Route.useParams();
  const tournament = useTournament(id);
  const [tab, setTab] = useState<Tab>("overview");

  if (!tournament) {
    return (
      <div className="min-h-screen bg-background pb-28">
        <div className="mx-auto max-w-md px-6 pt-16 text-center">
          <h1 className="text-xl font-semibold text-foreground">Tournament not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">It may have been removed.</p>
          <Link
            to="/tournaments"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
          >
            <ChevronLeft className="h-4 w-4" /> Back to tournaments
          </Link>
        </div>
        <MobileNav />
      </div>
    );
  }

  const participants = getParticipants(tournament);
  const standings = getStandings(tournament);
  const matches = getUpcomingMatches(tournament);
  const bracket = tournament.type === "Knockout" ? getBracket(tournament) : [];

  return (
    <div className="min-h-screen bg-background pb-28">
      <header
        className="px-6 pb-12 pt-12 text-primary-foreground"
        style={{ backgroundImage: "var(--gradient-hero)" }}
      >
        <div className="mx-auto max-w-md">
          <Link to="/tournaments" className="inline-flex items-center gap-1 text-sm text-white/80">
            <ChevronLeft className="h-4 w-4" /> All tournaments
          </Link>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">{tournament.name}</h1>
          <div className="mt-3 flex items-center gap-3 text-xs text-white/80">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 backdrop-blur">
              <Trophy className="h-3.5 w-3.5" /> {tournament.type}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 backdrop-blur">
              <Users className="h-3.5 w-3.5" /> {tournament.players} players
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto -mt-6 max-w-md px-6">
        <div className="rounded-2xl bg-card p-1.5 shadow-[var(--shadow-card)]">
          <div className="grid grid-cols-3 gap-1">
            {(["overview", "standings", "matches"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-xl px-3 py-2.5 text-xs font-semibold capitalize transition ${
                  tab === t
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t === "standings" ? (tournament.type === "League" ? "Standings" : "Bracket") : t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="mx-auto mt-4 max-w-md space-y-4 px-6">
        {tab === "overview" && (
          <section className="rounded-2xl bg-card p-5 shadow-[var(--shadow-card)]">
            <div className="mb-4 flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-card-foreground">Participants</h2>
              <span className="ml-auto text-xs text-muted-foreground">{participants.length}</span>
            </div>
            <ul className="divide-y divide-border">
              {participants.map((p, i) => (
                <li key={p.id} className="flex items-center gap-3 py-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-primary-foreground"
                    style={{ backgroundImage: "var(--gradient-pitch)" }}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-card-foreground">{p.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{p.club}</p>
                  </div>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </li>
              ))}
            </ul>
          </section>
        )}

        {tab === "standings" && tournament.type === "League" && (
          <section className="overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-2 border-b border-border px-5 py-4">
              <Trophy className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-card-foreground">League Table</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-muted-foreground">
                  <tr className="border-b border-border">
                    <th className="px-3 py-2 text-left font-medium">#</th>
                    <th className="px-2 py-2 text-left font-medium">Player</th>
                    <th className="px-2 py-2 text-center font-medium">P</th>
                    <th className="px-2 py-2 text-center font-medium">W</th>
                    <th className="px-2 py-2 text-center font-medium">D</th>
                    <th className="px-2 py-2 text-center font-medium">L</th>
                    <th className="px-3 py-2 text-center font-medium">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((s, i) => (
                    <tr key={s.participant.id} className="border-b border-border last:border-0">
                      <td className="px-3 py-2.5 text-muted-foreground">{i + 1}</td>
                      <td className="px-2 py-2.5">
                        <div className="font-medium text-card-foreground">{s.participant.name}</div>
                        <div className="text-[10px] text-muted-foreground">{s.participant.club}</div>
                      </td>
                      <td className="px-2 py-2.5 text-center text-muted-foreground">{s.played}</td>
                      <td className="px-2 py-2.5 text-center text-muted-foreground">{s.won}</td>
                      <td className="px-2 py-2.5 text-center text-muted-foreground">{s.drawn}</td>
                      <td className="px-2 py-2.5 text-center text-muted-foreground">{s.lost}</td>
                      <td className="px-3 py-2.5 text-center font-bold text-primary">{s.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {tab === "standings" && tournament.type === "Knockout" && (
          <section className="space-y-4">
            {bracket.map((round) => (
              <div key={round.name} className="rounded-2xl bg-card p-5 shadow-[var(--shadow-card)]">
                <h3 className="mb-3 text-sm font-semibold text-card-foreground">{round.name}</h3>
                <div className="space-y-2">
                  {round.pairs.map((pair, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-border bg-background p-3 text-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground">{pair.home.name}</span>
                        <span className="text-xs text-muted-foreground">vs</span>
                        <span className="font-medium text-foreground">{pair.away.name}</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
                        <span>{pair.home.club}</span>
                        <span>{pair.away.club}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}

        {tab === "matches" && (
          <section className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <Calendar className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Upcoming Matches</h2>
            </div>
            {matches.map((m) => (
              <div
                key={m.id}
                className="rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]"
              >
                <div className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-primary">
                  {m.round}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 text-right">
                    <div className="text-sm font-semibold text-card-foreground">{m.home.name}</div>
                    <div className="text-[10px] text-muted-foreground">{m.home.club}</div>
                  </div>
                  <div
                    className="rounded-lg px-3 py-1.5 text-xs font-bold text-primary-foreground"
                    style={{ backgroundImage: "var(--gradient-pitch)" }}
                  >
                    VS
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-card-foreground">{m.away.name}</div>
                    <div className="text-[10px] text-muted-foreground">{m.away.club}</div>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}
      </main>

      <MobileNav />
    </div>
  );
}