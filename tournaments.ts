import { useEffect, useState } from "react";

export type TournamentType = "League" | "Knockout";

export interface Tournament {
  id: string;
  name: string;
  type: TournamentType;
  players: number;
  createdAt: number;
}

const KEY = "twf:tournaments";

export function loadTournaments(): Tournament[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as Tournament[];
  } catch {
    return [];
  }
}

export function saveTournament(t: Tournament) {
  const all = loadTournaments();
  all.unshift(t);
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function useTournaments() {
  const [list, setList] = useState<Tournament[]>([]);
  useEffect(() => setList(loadTournaments()), []);
  return list;
}

export function useTournament(id: string): Tournament | undefined {
  const [t, setT] = useState<Tournament | undefined>(undefined);
  useEffect(() => setT(loadTournaments().find((x) => x.id === id)), [id]);
  return t;
}

const PLAYER_POOL = [
  "Alex", "Sam", "Jordan", "Taylor", "Casey", "Morgan", "Riley", "Avery",
  "Quinn", "Drew", "Reese", "Cameron", "Hayden", "Jamie", "Sky", "Rowan",
];

const CLUBS = [
  "FC Barcelona", "Real Madrid", "Man City", "Liverpool", "PSG", "Bayern",
  "Juventus", "Milan", "Inter", "Arsenal", "Chelsea", "Dortmund",
  "Atlético", "Napoli", "Tottenham", "Ajax",
];

export interface Participant {
  id: number;
  name: string;
  club: string;
}

export function getParticipants(t: Tournament): Participant[] {
  return Array.from({ length: t.players }, (_, i) => ({
    id: i,
    name: PLAYER_POOL[i % PLAYER_POOL.length],
    club: CLUBS[i % CLUBS.length],
  }));
}

export interface Standing {
  participant: Participant;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  points: number;
}

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function hashId(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function getStandings(t: Tournament): Standing[] {
  const rand = seeded(hashId(t.id));
  const ps = getParticipants(t);
  const rows = ps.map((p) => {
    const played = Math.floor(rand() * (t.players - 1));
    const won = Math.floor(rand() * (played + 1));
    const drawn = Math.floor(rand() * (played - won + 1));
    const lost = played - won - drawn;
    const gf = won * 2 + drawn + Math.floor(rand() * 5);
    const ga = lost * 2 + Math.floor(rand() * 4);
    return {
      participant: p,
      played, won, drawn, lost, gf, ga,
      points: won * 3 + drawn,
    };
  });
  rows.sort((a, b) => b.points - a.points || (b.gf - b.ga) - (a.gf - a.ga));
  return rows;
}

export interface Match {
  id: string;
  home: Participant;
  away: Participant;
  round: string;
}

export function getUpcomingMatches(t: Tournament): Match[] {
  const ps = getParticipants(t);
  const rand = seeded(hashId(t.id) + 1);
  const matches: Match[] = [];
  for (let i = 0; i < Math.min(4, Math.floor(t.players / 2)); i++) {
    const a = Math.floor(rand() * ps.length);
    let b = Math.floor(rand() * ps.length);
    if (b === a) b = (b + 1) % ps.length;
    matches.push({
      id: `m-${i}`,
      home: ps[a],
      away: ps[b],
      round: t.type === "League" ? `Matchday ${i + 1}` : ["Quarter-final", "Semi-final", "Final"][i] ?? `Round ${i + 1}`,
    });
  }
  return matches;
}

export interface BracketRound {
  name: string;
  pairs: Array<{ home: Participant; away: Participant }>;
}

export function getBracket(t: Tournament): BracketRound[] {
  const ps = getParticipants(t);
  const rounds: BracketRound[] = [];
  let current = ps.slice();
  const names = ["Round of 16", "Quarter-finals", "Semi-finals", "Final"];
  while (current.length >= 2) {
    const pairs: BracketRound["pairs"] = [];
    for (let i = 0; i < current.length; i += 2) {
      pairs.push({ home: current[i], away: current[i + 1] ?? current[i] });
    }
    const label =
      pairs.length === 1 ? "Final" :
      pairs.length === 2 ? "Semi-finals" :
      pairs.length === 4 ? "Quarter-finals" :
      pairs.length === 8 ? "Round of 16" :
      `Round of ${pairs.length * 2}`;
    rounds.push({ name: label, pairs });
    current = pairs.map((p) => p.home);
    if (rounds.length > 5) break;
  }
  return rounds;
}