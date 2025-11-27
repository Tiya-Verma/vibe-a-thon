import type { Recipe } from "./sampleData";

export type PlannedMeal = {
  slot: "breakfast" | "lunch" | "dinner";
  recipeId: string;
};

export type DayPlan = {
  day: string;
  meals: PlannedMeal[];
  estimatedDailyCost: number;
};

export type GroceryListItem = {
  name: string;
  count: number;
};

export type WeeklyPlanResult = {
  days: DayPlan[];
  grocery: GroceryListItem[];
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export type PlanOptions = {
  dailyBudgetCAD: number;
  includeTags?: string[]; // e.g., ["vegetarian","budget"]
};

export function generateWeeklyPlan(
  recipes: Recipe[],
  options: PlanOptions
): WeeklyPlanResult {
  const { dailyBudgetCAD, includeTags = [] } = options;

  const byTag = (tag: string) =>
    recipes.filter((r) => r.tags.includes(tag) && hasAllTags(r, includeTags));
  const breakfasts = byTag("breakfast");
  const mains = recipes.filter(
    (r) =>
      !r.tags.includes("breakfast") &&
      hasAllTags(r, includeTags) &&
      r.estimatedCostPerServingCAD <= dailyBudgetCAD
  );

  // Fallbacks if filters are too strict
  const safeBreakfasts = breakfasts.length > 0 ? breakfasts : recipes;
  const safeMains = mains.length > 0 ? mains : recipes;

  const days: DayPlan[] = [];
  let groceryNameToCount: Record<string, number> = {};

  for (let i = 0; i < 7; i++) {
    const b = pickCyclic(safeBreakfasts, i);
    const l = pickCyclic(safeMains, i);
    const d = pickCyclic(safeMains, i + 3);

    const estCost =
      (b?.estimatedCostPerServingCAD ?? 0) +
      (l?.estimatedCostPerServingCAD ?? 0) +
      (d?.estimatedCostPerServingCAD ?? 0);

    // Gentle budget adjustment: if over budget, swap dinner to a cheaper main if available
    const maxTries = 3;
    let dinner = d;
    let tries = 0;
    while (
      estCost > dailyBudgetCAD + 1 && // allow small epsilon
      tries < maxTries
    ) {
      const cheaper = safeMains
        .filter(
          (r) =>
            r.estimatedCostPerServingCAD <=
            (dinner?.estimatedCostPerServingCAD ?? Infinity) - 0.5
        )
        .at((i + tries) % Math.max(1, safeMains.length));
      if (!cheaper) break;
      dinner = cheaper;
      tries++;
    }

    const meals: PlannedMeal[] = [
      b ? { slot: "breakfast", recipeId: b.id } : null,
      l ? { slot: "lunch", recipeId: l.id } : null,
      dinner ? { slot: "dinner", recipeId: dinner.id } : null,
    ].filter(Boolean) as PlannedMeal[];

    // Build naive grocery list: count ingredient name occurrences
    [b, l, dinner].forEach((rec) => {
      if (!rec) return;
      rec.ingredients.forEach((ing) => {
        groceryNameToCount[ing.name] = (groceryNameToCount[ing.name] ?? 0) + 1;
      });
    });

    days.push({
      day: DAYS[i],
      meals,
      estimatedDailyCost:
        (b?.estimatedCostPerServingCAD ?? 0) +
        (l?.estimatedCostPerServingCAD ?? 0) +
        (dinner?.estimatedCostPerServingCAD ?? 0),
    });
  }

  const grocery: GroceryListItem[] = Object.entries(groceryNameToCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return { days, grocery };
}

function pickCyclic<T>(arr: T[], index: number): T | undefined {
  if (arr.length === 0) return undefined;
  return arr[index % arr.length];
}

function hasAllTags(recipe: Recipe, required: string[]): boolean {
  if (!required.length) return true;
  return required.every((t) => recipe.tags.includes(t));
}


