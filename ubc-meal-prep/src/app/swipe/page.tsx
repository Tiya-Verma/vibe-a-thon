"use client";

import { useMemo, useState } from "react";
import { type Recipe } from "@/lib/sampleData";
import { getBrainrotRecipes } from "@/lib/brainrotAdapter";
import { getBookmarks, getVibe, toggleBookmark } from "@/lib/storage";
import Link from "next/link";

function filterByVibe(recipes: Recipe[]) {
  const vibe = getVibe();
  if (!vibe) return recipes;
  const filtered = recipes.filter((r) => r.vibeTags?.includes(vibe));
  return filtered.length ? filtered : recipes;
}

export default function SwipePage() {
  const deck = useMemo(() => filterByVibe(getBrainrotRecipes()), []);
  const [index, setIndex] = useState(0);
  const [bookmarks, setBookmarks] = useState<string[]>(getBookmarks());
  const recipe = deck[index];

  const next = () => setIndex((i) => Math.min(i + 1, deck.length - 1));
  const prev = () => setIndex((i) => Math.max(i - 1, 0));

  const onSave = () => {
    if (!recipe) return;
    const nextMarks = toggleBookmark(recipe.id);
    setBookmarks(nextMarks);
    next();
  };
  const onSkip = () => next();
  const onBookmark = () => {
    if (!recipe) return;
    const nextMarks = toggleBookmark(recipe.id);
    setBookmarks(nextMarks);
  };

  if (!recipe) {
    return (
      <section className="space-y-4 text-center">
        <h1 className="text-2xl font-semibold">No more recipes</h1>
        <p className="text-zinc-600">Change your vibe or browse recipes.</p>
        <div className="flex justify-center gap-3">
          <Link className="rounded-md border px-4 py-2" href="/onboarding">
            Change Vibe
          </Link>
          <Link
            className="rounded-md bg-blue-900 px-4 py-2 text-yellow-400"
            href="/recipes"
          >
            Recipes
          </Link>
        </div>
      </section>
    );
  }

  const isBookmarked = bookmarks.includes(recipe.id);

  return (
    <section className="mx-auto max-w-md space-y-4">
      <div className="rounded-2xl border bg-white p-4 shadow">
        <div className="h-48 rounded-xl bg-gradient-to-br from-blue-50 to-yellow-100" />
        <h2 className="mt-4 text-xl font-bold text-blue-900">
          {recipe.name}
        </h2>
        <div className="mt-1 flex flex-wrap gap-2 text-xs">
          {(recipe.vibeTags ?? []).map((t) => (
            <span
              key={t}
              className="rounded-full bg-blue-50 px-2 py-0.5 text-blue-900"
            >
              #{t}
            </span>
          ))}
          {recipe.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-yellow-100 px-2 py-0.5 text-blue-900"
            >
              #{t}
            </span>
          ))}
        </div>
        <p className="mt-2 text-sm text-zinc-700">{recipe.description}</p>
        <div className="mt-3 text-sm text-zinc-700">
          ~ ${recipe.estimatedCostPerServingCAD.toFixed(2)} / serving ·{" "}
          {recipe.estimatedCaloriesPerServing} kcal
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 text-2xl">
        <button
          aria-label="Skip"
          onClick={onSkip}
          className="rounded-full bg-gray-100 px-4 py-2 hover:bg-gray-200"
        >
          💀
        </button>
        <Link
          href={`/recipes/${recipe.id}`}
          className="rounded-full bg-yellow-100 px-4 py-2 hover:bg-yellow-200"
        >
          ⬆️
        </Link>
        <button
          aria-label="Bookmark"
          onClick={onBookmark}
          className={`rounded-full px-4 py-2 ${
            isBookmarked ? "bg-yellow-400" : "bg-yellow-100 hover:bg-yellow-200"
          }`}
        >
          ⭐
        </button>
        <button
          aria-label="Cook This"
          onClick={onSave}
          className="rounded-full bg-blue-900 px-4 py-2 text-yellow-400 hover:bg-blue-800"
        >
          ❤️
        </button>
      </div>

      <div className="flex items-center justify-between text-sm text-zinc-600">
        <button onClick={prev} className="hover:underline">
          Back
        </button>
        <span>
          {index + 1} / {deck.length}
        </span>
      </div>
    </section>
  );
}


