"use client";

import { useEffect, useMemo, useState } from "react";
import { getBrainrotRecipes } from "@/lib/brainrotAdapter";
import { generateWeeklyPlan, type WeeklyPlanResult } from "@/lib/plan";

export default function PlannerPage() {
  const [dailyBudget, setDailyBudget] = useState<number>(8);
  const [prefs, setPrefs] = useState<string[]>([]);
  const [plan, setPlan] = useState<WeeklyPlanResult | null>(null);

  useEffect(() => {
    const cached = localStorage.getItem("weeklyPlan");
    if (cached) {
      try {
        setPlan(JSON.parse(cached));
      } catch {
        // ignore
      }
    }
  }, []);

  const onTogglePref = (tag: string) => {
    setPrefs((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const onGenerate = () => {
    const result = generateWeeklyPlan(getBrainrotRecipes(), {
      dailyBudgetCAD: dailyBudget,
      includeTags: prefs,
    });
    setPlan(result);
    localStorage.setItem("weeklyPlan", JSON.stringify(result));
  };

  const totalWeekCost = useMemo(() => {
    if (!plan) return 0;
    return plan.days.reduce((sum, d) => sum + d.estimatedDailyCost, 0);
  }, [plan]);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Weekly Planner</h1>
        <p className="text-zinc-600">
          Generate a 7-day plan from curated recipes. Set a daily budget and
          preferences.
        </p>
      </div>

      <div className="rounded-lg border bg-white p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <label className="flex flex-col">
            <span className="text-sm text-zinc-700">Daily budget (CAD)</span>
            <input
              type="number"
              min={3}
              step={0.5}
              value={dailyBudget}
              onChange={(e) => setDailyBudget(Number(e.target.value))}
              className="mt-1 w-40 rounded-md border px-3 py-2"
            />
          </label>
          <fieldset className="flex flex-wrap gap-4">
            <legend className="sr-only">Preferences</legend>
            {[
              { tag: "vegetarian", label: "Vegetarian" },
              { tag: "vegan", label: "Vegan" },
              { tag: "high-protein", label: "High protein" },
              { tag: "budget", label: "Budget" },
            ].map(({ tag, label }) => (
              <label key={tag} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={prefs.includes(tag)}
                  onChange={() => onTogglePref(tag)}
                />
                {label}
              </label>
            ))}
          </fieldset>
          <button
            onClick={onGenerate}
            className="inline-flex w-fit items-center justify-center rounded-md bg-black px-4 py-2 text-white hover:bg-zinc-800"
          >
            Generate Plan
          </button>
        </div>
      </div>

      {plan && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Your Plan</h2>
            <div className="text-sm text-zinc-700">
              ~ ${totalWeekCost.toFixed(2)} for the week
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {plan.days.map((d) => (
              <div key={d.day} className="rounded-lg border bg-white p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-medium">{d.day}</h3>
                  <span className="text-xs text-zinc-600">
                    ~ ${d.estimatedDailyCost.toFixed(2)}
                  </span>
                </div>
                <ul className="space-y-2 text-sm">
                  {d.meals.map((m) => {
                    const recipe = getBrainrotRecipes().find(
                      (r) => r.id === m.recipeId
                    );
                    return (
                      <li
                        key={m.slot}
                        className="flex items-center justify-between rounded-md bg-zinc-50 px-3 py-2"
                      >
                        <span className="capitalize">{m.slot}</span>
                        <span className="text-right text-zinc-700">
                          {recipe?.name ?? m.recipeId}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-2" />
        </div>
      )}
    </section>
  );
}
