"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Recipe } from "@/lib/sampleData";

type IngredientInput = { name: string; quantity: string };

export default function NewRecipePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string>("budget, residence");
  const [estimatedCostPerServingCAD, setCost] = useState<number>(3);
  const [estimatedCaloriesPerServing, setCalories] = useState<number>(500);
  const [servings, setServings] = useState<number>(2);
  const [ingredients, setIngredients] = useState<IngredientInput[]>([
    { name: "", quantity: "" },
  ]);
  const [error, setError] = useState<string | null>(null);

  const onAddIngredient = () =>
    setIngredients((prev) => [...prev, { name: "", quantity: "" }]);

  const onRemoveIngredient = (idx: number) =>
    setIngredients((prev) => prev.filter((_, i) => i !== idx));

  const onChangeIngredient = (
    idx: number,
    field: keyof IngredientInput,
    value: string
  ) =>
    setIngredients((prev) =>
      prev.map((ing, i) => (i === idx ? { ...ing, [field]: value } : ing))
    );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) return setError("Please enter a recipe name.");
    const cleanedIngredients = ingredients.filter(
      (i) => i.name.trim() && i.quantity.trim()
    );
    if (cleanedIngredients.length === 0)
      return setError("Add at least one ingredient with a quantity.");

    const recipe: Recipe = {
      id: `user-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || "User submitted recipe.",
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      estimatedCostPerServingCAD: Number(estimatedCostPerServingCAD) || 0,
      estimatedCaloriesPerServing: Number(estimatedCaloriesPerServing) || 0,
      servings: Number(servings) || 1,
      ingredients: cleanedIngredients,
    };

    try {
      const existingRaw = localStorage.getItem("userRecipes");
      const existing = existingRaw ? (JSON.parse(existingRaw) as Recipe[]) : [];
      const next = [recipe, ...existing];
      localStorage.setItem("userRecipes", JSON.stringify(next));
      router.push("/recipes");
    } catch (err) {
      setError("Failed to save recipe. Please try again.");
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-blue-900">Add a Recipe</h1>
        <p className="text-zinc-600">
          Share your UBC-friendly, budget-conscious meal idea.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-6 rounded-xl border bg-white p-6"
      >
        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col">
            <span className="text-sm text-zinc-700">Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 rounded-md border px-3 py-2"
              placeholder="Thunderbird Tofu"
              required
            />
          </label>
          <label className="flex flex-col">
            <span className="text-sm text-zinc-700">Tags (comma separated)</span>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="mt-1 rounded-md border px-3 py-2"
              placeholder="budget, high-protein, vegetarian"
            />
          </label>
          <label className="flex flex-col sm:col-span-2">
            <span className="text-sm text-zinc-700">Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 min-h-24 rounded-md border px-3 py-2"
              placeholder="Residence-kitchen friendly notes, tips, etc."
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="flex flex-col">
            <span className="text-sm text-zinc-700">Cost per serving (CAD)</span>
            <input
              type="number"
              min={0}
              step={0.1}
              value={estimatedCostPerServingCAD}
              onChange={(e) => setCost(Number(e.target.value))}
              className="mt-1 rounded-md border px-3 py-2"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-sm text-zinc-700">Calories per serving</span>
            <input
              type="number"
              min={0}
              step={10}
              value={estimatedCaloriesPerServing}
              onChange={(e) => setCalories(Number(e.target.value))}
              className="mt-1 rounded-md border px-3 py-2"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-sm text-zinc-700">Servings</span>
            <input
              type="number"
              min={1}
              value={servings}
              onChange={(e) => setServings(Number(e.target.value))}
              className="mt-1 rounded-md border px-3 py-2"
            />
          </label>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-medium text-blue-900">Ingredients</h2>
            <button
              type="button"
              onClick={onAddIngredient}
              className="rounded-md bg-yellow-500 px-3 py-1.5 text-sm font-semibold text-blue-900 hover:bg-yellow-400"
            >
              + Add ingredient
            </button>
          </div>
          <div className="space-y-3">
            {ingredients.map((ing, idx) => (
              <div
                key={idx}
                className="grid items-center gap-3 sm:grid-cols-[1fr_1fr_auto]"
              >
                <input
                  value={ing.name}
                  onChange={(e) =>
                    onChangeIngredient(idx, "name", e.target.value)
                  }
                  placeholder="Ingredient"
                  className="rounded-md border px-3 py-2"
                />
                <input
                  value={ing.quantity}
                  onChange={(e) =>
                    onChangeIngredient(idx, "quantity", e.target.value)
                  }
                  placeholder="Quantity (e.g., 1 cup)"
                  className="rounded-md border px-3 py-2"
                />
                <button
                  type="button"
                  onClick={() => onRemoveIngredient(idx)}
                  className="rounded-md border px-3 py-2 text-sm hover:bg-zinc-50"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-md bg-blue-900 px-4 py-2 font-medium text-yellow-400 hover:bg-blue-800"
          >
            Save Recipe
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md border px-4 py-2 hover:bg-zinc-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}


