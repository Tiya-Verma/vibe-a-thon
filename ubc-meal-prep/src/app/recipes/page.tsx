"use client";

import { useEffect, useState } from "react";
import { type Recipe } from "@/lib/sampleData";
import { getBrainrotRecipes } from "@/lib/brainrotAdapter";

export default function RecipesPage() {
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("userRecipes");
      if (raw) setUserRecipes(JSON.parse(raw) as Recipe[]);
    } catch {
      // ignore parse errors
    }
  }, []);

  const allRecipes: Recipe[] = [...userRecipes, ...getBrainrotRecipes()];

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Recipes</h1>
        <p className="text-zinc-600">
          Budget-friendly, residence-kitchen-ready ideas. More filters coming soon.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {allRecipes.map((r) => (
          <article
            key={r.id}
            className="rounded-lg border bg-white p-4 shadow-sm"
          >
            <h2 className="text-lg font-semibold">{r.name}</h2>
            <p className="mt-1 text-sm text-zinc-600 line-clamp-3">
              {r.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {r.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-zinc-100 px-2 py-0.5 text-zinc-700"
                >
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-3 text-sm text-zinc-700">
              ~ ${r.estimatedCostPerServingCAD.toFixed(2)} / serving ·{" "}
              {r.estimatedCaloriesPerServing} kcal
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}


