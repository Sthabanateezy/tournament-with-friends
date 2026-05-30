import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, Trophy } from "lucide-react";
import { useState } from "react";
import { MobileNav } from "@/components/MobileNav";
import { saveTournament, type TournamentType } from "@/lib/tournaments";
import { toast } from "sonner";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "Create Tournament — Tournament with Friends" },
      { name: "description", content: "Set up a new eFootball league or knockout tournament." },
    ],
  }),
  component: CreatePage,
});

const PLAYER_OPTIONS = [4, 6, 8, 10, 12, 16];

function CreatePage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [type, setType] = useState<TournamentType>("League");
  const [players, setPlayers] = useState(8);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter a tournament name");
      return;
    }
    saveTournament({
      id: crypto.randomUUID(),
      name: name.trim(),
      type,
      players,
      createdAt: Date.now(),
    });
    toast.success("Tournament created!");
    navigate({ to: "/tournaments" });
  };

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
          <h1 className="mt-3 text-3xl font-bold tracking-tight">New Tournament</h1>
          <p className="mt-1 text-sm text-white/80">Set the stage for your next showdown.</p>
        </div>
      </header>

      <form onSubmit={submit} className="mx-auto -mt-6 max-w-md space-y-4 px-6">
        <div className="rounded-2xl bg-card p-5 shadow-[var(--shadow-card)] space-y-5">
          <div>
            <label htmlFor="name" className="text-sm font-medium text-card-foreground">
              Tournament Name
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Champions League Night"
              className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-base text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30"
            />
          </div>

          <div>
            <label htmlFor="type" className="text-sm font-medium text-card-foreground">
              Tournament Type
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as TournamentType)}
              className="mt-2 w-full appearance-none rounded-xl border border-input bg-background px-4 py-3 text-base text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30"
            >
              <option value="League">League</option>
              <option value="Knockout">Knockout</option>
            </select>
          </div>

          <div>
            <label htmlFor="players" className="text-sm font-medium text-card-foreground">
              Number of Players
            </label>
            <select
              id="players"
              value={players}
              onChange={(e) => setPlayers(Number(e.target.value))}
              className="mt-2 w-full appearance-none rounded-xl border border-input bg-background px-4 py-3 text-base text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30"
            >
              {PLAYER_OPTIONS.map((n) => (
                <option key={n} value={n}>{n} players</option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-semibold text-primary-foreground shadow-[var(--shadow-elevated)] transition active:scale-[0.98]"
          style={{ backgroundImage: "var(--gradient-pitch)" }}
        >
          <Trophy className="h-5 w-5" />
          Create Tournament
        </button>
      </form>

      <MobileNav />
    </div>
  );
}