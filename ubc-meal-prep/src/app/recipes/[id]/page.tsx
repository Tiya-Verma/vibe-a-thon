"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { getBrainrotRecipes } from "@/lib/brainrotAdapter";
import { toggleBookmark } from "@/lib/storage";

export default function RecipeDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const recipe = useMemo(
    () => getBrainrotRecipes().find((r) => r.id === params.id),
    [params.id]
  );

  if (!recipe) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold">Recipe not found</h1>
        <button
          onClick={() => router.back()}
          className="rounded-md border px-4 py-2"
        >
          Back
        </button>
      </section>
    );
  }

  const saveForLater = () => {
    toggleBookmark(recipe.id);
    router.push("/swipe");
  };

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <div className="h-56 rounded-xl bg-gradient-to-br from-blue-50 to-yellow-100" />
      <div>
        <h1 className="text-3xl font-bold text-blue-900">{recipe.name}</h1>
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
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
        <p className="mt-3 text-zinc-700">{recipe.description}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="mb-2 text-lg font-semibold">Ingredients</h2>
          <ul className="list-disc pl-5 text-sm">
            {recipe.ingredients.map((ing, i) => (
              <li key={i}>
                {ing.name}
                {ing.quantity ? ` — ${ing.quantity}` : ""}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-2 text-lg font-semibold">Instructions</h2>
          <ol className="list-decimal pl-5 text-sm">
            <li>Prep ingredients.</li>
            <li>Cook according to vibe and common sense.</li>
            <li>Plate cutely. Post. Slay.</li>
          </ol>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={saveForLater}
          className="rounded-md bg-blue-900 px-4 py-2 font-medium text-yellow-400 hover:bg-blue-800"
        >
          Save for Later
        </button>
        <button
          onClick={() => router.push("/swipe")}
          className="rounded-md border px-4 py-2"
        >
          Back to swiping
        </button>
      </div>

      <p className="pt-4 text-sm italic text-zinc-500">
        “This meal screams ‘I will get my life together tomorrow.’”
      </p>
    </section>
  );
}


