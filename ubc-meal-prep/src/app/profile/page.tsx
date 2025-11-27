"use client";

import Link from "next/link";
import {
  getBookmarks,
  getMemeIntensity,
  getVibe,
  setMemeIntensity,
  setVibe,
  type MemeIntensity,
  type Vibe,
} from "@/lib/storage";
import { useEffect, useState } from "react";
import { sampleRecipes } from "@/lib/sampleData";

export default function ProfilePage() {
  const [vibe, setV] = useState<Vibe | null>(null);
  const [meme, setMeme] = useState<MemeIntensity>("normal");
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    setV(getVibe());
    setMeme(getMemeIntensity());
    setBookmarks(getBookmarks());
  }, []);

  const onVibe = (v: Vibe) => {
    setV(v);
    setVibe(v);
  };
  const onMeme = (m: MemeIntensity) => {
    setMeme(m);
    setMemeIntensity(m);
  };

  const bookmarked = sampleRecipes.filter((r) => bookmarks.includes(r.id));

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Profile & Settings</h1>
        <p className="text-zinc-600">Your vibe, bookmarks and preferences.</p>
      </div>

      <div className="rounded-lg border bg-white p-4">
        <h2 className="mb-2 font-medium text-blue-900">Arc vibe</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { key: "delulu", label: "Delulu" },
            { key: "academic", label: "Academic" },
            { key: "gremlin", label: "Gremlin" },
            { key: "glow", label: "Glow-Up" },
            { key: "villain", label: "Villain" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => onVibe(key as Vibe)}
              className={`rounded-full border px-3 py-1.5 text-sm ${
                vibe === key ? "bg-yellow-300" : "bg-blue-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg border bg-white p-4">
        <h2 className="mb-2 font-medium text-blue-900">Meme intensity</h2>
        <div className="flex gap-2">
          {[
            { k: "normal", label: "Normal" },
            { k: "unhinged", label: "Unhinged 🧠" },
          ].map(({ k, label }) => (
            <button
              key={k}
              onClick={() => onMeme(k as MemeIntensity)}
              className={`rounded-full border px-3 py-1.5 text-sm ${
                meme === k ? "bg-yellow-300" : "bg-blue-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg border bg-white p-4">
        <h2 className="mb-2 font-medium text-blue-900">Bookmarked recipes</h2>
        {bookmarked.length === 0 ? (
          <p className="text-sm text-zinc-600">No bookmarks yet.</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {bookmarked.map((r) => (
              <li key={r.id} className="rounded-md border p-3">
                <p className="font-medium">{r.name}</p>
                <Link
                  href={`/recipes/${r.id}`}
                  className="mt-1 inline-block text-sm text-blue-700 hover:underline"
                >
                  View
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}


