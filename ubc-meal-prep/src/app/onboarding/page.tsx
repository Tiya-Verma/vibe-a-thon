"use client";

import { useRouter } from "next/navigation";
import { setVibe, type Vibe } from "@/lib/storage";
import Image from "next/image";

const VIBES: { key: Vibe; label: string; emoji: string }[] = [
  { key: "delulu", label: "Delulu", emoji: "✨" },
  { key: "academic", label: "Academic Weapon", emoji: "📚" },
  { key: "gremlin", label: "Gremlin Mode", emoji: "🧟" },
  { key: "glow", label: "Glow-Up Era", emoji: "🌟" },
  { key: "villain", label: "Villain Arc", emoji: "😈" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const onSelect = (v: Vibe) => setVibe(v);

  const start = () => {
    router.push("/swipe");
  };

  return (
    <section className="mx-auto max-w-3xl space-y-8 text-center rounded-2xl bg-pink-50 p-8 shadow-sm">
      <div className="flex flex-col items-center gap-3">
        <div className="relative h-24 w-24">
          <Image
            src="/next.svg"
            alt="Brainrot Cook"
            fill
            className="object-contain"
          />
        </div>
        <h1 className="text-4xl font-extrabold text-pink-600">
          Brainrot MealPrep
        </h1>
        <p className="text-lg text-pink-500">
          Swipe Your Next Chaos Meal Prep.
        </p>
      </div>

      <div className="space-y-3">
        <p className="font-medium text-pink-700">What vibe are you in?</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {VIBES.map((v) => (
            <button
              key={v.key}
              onClick={() => onSelect(v.key)}
              className="rounded-full border border-pink-200 bg-pink-100 px-4 py-2 text-sm text-pink-700 hover:bg-pink-200"
            >
              <span className="mr-1">{v.emoji}</span>
              {v.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={start}
        className="rounded-2xl bg-pink-500 px-6 py-3 font-semibold text-white shadow-md hover:bg-pink-400"
      >
        Start Swiping
      </button>
    </section>
  );
}


