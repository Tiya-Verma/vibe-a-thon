import type { Recipe, Ingredient } from "@/lib/sampleData";
import type { BrainrotDB, BrainrotEntry } from "@/lib/brainrot";
import { brainrotRecipes } from "@/lib/brainrot";

function toIngredients(list: string[]): Ingredient[] {
  return list.map((line) => ({ name: line, quantity: "" }));
}

function vibesForCategory(category: keyof BrainrotDB): string[] {
  switch (category) {
    case "desserts":
      return ["delulu", "glow"];
    case "comfortFood":
      return ["gremlin", "villain"];
    case "healthy":
      return ["glow", "academic"];
    case "breakfast":
      return ["academic", "glow"];
    case "snacks":
      return ["gremlin", "delulu"];
    default:
      return [];
  }
}

function mapEntry(e: BrainrotEntry, category: keyof BrainrotDB): Recipe {
  return {
    id: `brainrot-${e.id}`,
    name: e.name,
    description: e.description,
    tags: Array.from(new Set([category, ...e.tags])),
    vibeTags: vibesForCategory(category),
    estimatedCostPerServingCAD: 3.0, // heuristic defaults
    estimatedCaloriesPerServing: 500, // heuristic defaults
    servings: e.servings,
    ingredients: toIngredients(e.ingredients),
  };
}

export function getBrainrotRecipes(): Recipe[] {
  const out: Recipe[] = [];
  (Object.keys(brainrotRecipes) as (keyof BrainrotDB)[]).forEach((cat) => {
    const entries = brainrotRecipes[cat] || [];
    entries.forEach((e) => out.push(mapEntry(e, cat)));
  });
  return out;
}


