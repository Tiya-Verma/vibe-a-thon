export type Ingredient = {
  name: string;
  quantity: string;
};

export type Recipe = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  vibeTags?: string[]; // e.g., ["delulu","academic","gremlin","glow","villain"]
  estimatedCostPerServingCAD: number;
  estimatedCaloriesPerServing: number;
  servings: number;
  ingredients: Ingredient[];
};

export const sampleRecipes: Recipe[] = [
  {
    id: "oats-pb-banana",
    name: "Overnight Oats with PB & Banana",
    description:
      "Protein-packed breakfast you can prep in a residence fridge. No cooking.",
    tags: ["breakfast", "no-cook", "vegetarian", "budget"],
    vibeTags: ["glow", "delulu"],
    estimatedCostPerServingCAD: 1.8,
    estimatedCaloriesPerServing: 450,
    servings: 1,
    ingredients: [
      { name: "Rolled oats", quantity: "1/2 cup" },
      { name: "Milk or oat milk", quantity: "3/4 cup" },
      { name: "Peanut butter", quantity: "1 tbsp" },
      { name: "Banana", quantity: "1/2" },
      { name: "Chia seeds (optional)", quantity: "1 tsp" },
    ],
  },
  {
    id: "chickpea-salad-wrap",
    name: "Chickpea Salad Wrap",
    description:
      "Quick lunch with pantry staples; great between classes on Main Mall.",
    tags: ["lunch", "no-cook", "vegetarian", "high-fiber", "budget"],
    vibeTags: ["academic", "glow"],
    estimatedCostPerServingCAD: 2.5,
    estimatedCaloriesPerServing: 520,
    servings: 1,
    ingredients: [
      { name: "Canned chickpeas, drained", quantity: "3/4 cup" },
      { name: "Greek yogurt or mayo", quantity: "2 tbsp" },
      { name: "Tortilla wrap", quantity: "1" },
      { name: "Spinach", quantity: "1/2 cup" },
      { name: "Lemon juice", quantity: "1 tsp" },
      { name: "Salt & pepper", quantity: "to taste" },
    ],
  },
  {
    id: "one-pot-pasta",
    name: "One-Pot Tomato Basil Pasta",
    description:
      "Minimal dishes; residence-kitchen friendly. Cook everything in one pot.",
    tags: ["dinner", "stovetop", "budget", "batch-cook"],
    vibeTags: ["gremlin", "villain"],
    estimatedCostPerServingCAD: 3.2,
    estimatedCaloriesPerServing: 600,
    servings: 4,
    ingredients: [
      { name: "Dry pasta", quantity: "300 g" },
      { name: "Canned diced tomatoes", quantity: "1 can" },
      { name: "Onion, sliced", quantity: "1/2" },
      { name: "Garlic, minced", quantity: "2 cloves" },
      { name: "Basil (fresh or dry)", quantity: "1 tbsp" },
      { name: "Olive oil", quantity: "1 tbsp" },
      { name: "Salt", quantity: "1/2 tsp" },
    ],
  },
  {
    id: "tofu-stir-fry",
    name: "Simple Tofu Veggie Stir-Fry",
    description:
      "Protein-forward dinner using frozen veg. Works with any residence pan.",
    tags: ["dinner", "stovetop", "high-protein", "budget"],
    vibeTags: ["academic", "villain"],
    estimatedCostPerServingCAD: 3.6,
    estimatedCaloriesPerServing: 520,
    servings: 3,
    ingredients: [
      { name: "Firm tofu", quantity: "350 g" },
      { name: "Frozen mixed vegetables", quantity: "3 cups" },
      { name: "Soy sauce", quantity: "2 tbsp" },
      { name: "Rice (uncooked)", quantity: "1 cup" },
      { name: "Garlic powder", quantity: "1/2 tsp" },
      { name: "Sesame oil (optional)", quantity: "1 tsp" },
    ],
  },
];


