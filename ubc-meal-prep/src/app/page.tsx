"use client";

import React, { useState, useEffect } from 'react';
import { Heart, X, Plus, Sparkles, ChefHat, Camera } from 'lucide-react';

type RecipeLite = {
  name: string;
  ingredients: string[];
  instructions: string;
  description?: string;
  brainrotDescription?: string;
  imageUrl?: string;
};

const BrainrotGirlDinner = () => {
  const [activeTab, setActiveTab] = useState('meals');
  const [meals, setMeals] = useState<{ id: number; name: string; ingredients: string; tag: string; image: string }[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMeal, setNewMeal] = useState({ name: '', ingredients: '', tag: '', image: '' });
  
  // Community/Tinder state
  const [craving, setCraving] = useState('');
  const [matchingRecipes, setMatchingRecipes] = useState<RecipeLite[]>([]);
  const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeLite | null>(null);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Brainrot recipe database
  const recipeDatabase = {
    desserts: [
      { 
        name: 'Skibidi Toilet Chocolate Cake', 
        description: "A bussin' chocolate cake that's giving major W energy",
        ingredients: ['2 cups all-purpose flour', '2 cups sugar (no cap)', '3/4 cup cocoa powder (the good stuff fr fr)', '2 tsp baking soda', '1 tsp baking powder', '1 tsp salt (just a smidge)', '2 eggs (cage-free and slay)', '1 cup buttermilk (or milk with vinegar)', '1 cup hot water (respectfully)', '1/2 cup vegetable oil', '2 tsp vanilla extract (chef\'s kiss)'], 
        instructions: 'Preheat oven to 350°F (no lowkey temperatures here)\nMix all dry ingredients together - they\'re about to go crazy\nAdd eggs, buttermilk, oil, and vanilla. Beat it like it owes you Robux\nStir in hot water (batter will be thin but trust the process bestie)\nPour into greased pans and bake for 30-35 mins\nLet it cool or you\'ll get cooked yourself\nFrost with your fave icing and serve. It\'s giving delicious',
        difficulty: 'Mid',
        prepTime: '15 mins',
        cookTime: '35 mins'
      },
      { 
        name: 'Rizz-Berry Cheesecake', 
        description: "This cheesecake has more rizz than a level 10 gyatt",
        ingredients: ['2 cups graham cracker crumbs (crushed with aggression)', '1/2 cup melted butter (liquid gold fr)', '32 oz cream cheese (softened, not stiff)', '1 cup sugar (sweet like your personality)', '1 tsp vanilla (the vibe setter)', '4 eggs (unborn chickens respectfully)', '2 cups mixed berries (strawberries, blueberries, raspberries)', '1/4 cup berry jam (for the drip)'], 
        instructions: 'Mix graham crackers and butter, press into pan. It\'s giving foundation\nBeat cream cheese until smooth (no lumps allowed in this house)\nAdd sugar and vanilla, mix until it\'s serving consistency\nAdd eggs one at a time (they\'re joining the party individually)\nPour over crust and bake at 325°F for 55 mins\nLet it chill in the fridge for 4 hours minimum (patience is a virtue)\nTop with berries and jam. Absolutely devious work',
        difficulty: 'Try-hard',
        prepTime: '20 mins',
        cookTime: '55 mins'
      }
    ],
    comfort: [
      { 
        name: "Bussin' Mac and Cheese", 
        description: "Mac and cheese that hits different. Absolutely goated",
        ingredients: ['1 lb elbow macaroni (the OGs)', '4 cups shredded cheddar cheese (sharp like your comeback)', '2 cups milk (whole milk slaps harder)', '1/4 cup butter (the real MVP)', '1/4 cup flour (thickening agent fr)', '1 tsp mustard powder (secret weapon)', 'Salt and pepper (to taste, no cap)', '1 cup breadcrumbs (for the crunch factor)'], 
        instructions: 'Cook macaroni according to package. Don\'t overcook it or it\'s an L\nMelt butter in a saucepan (medium heat, we\'re not trying to start a fire)\nAdd flour and whisk for 1 min. It\'s thickening era\nSlowly add milk while whisking (this is where boys become men)\nAdd mustard powder, salt, and pepper. Season that bad boy\nRemove from heat and add 3 cups cheese. Stir until melted\nMix with pasta, top with remaining cheese and breadcrumbs\nBake at 350°F for 20 mins. The crunch is immaculate',
        difficulty: 'Easy dub',
        prepTime: '15 mins',
        cookTime: '30 mins'
      },
      { 
        name: 'Sigma Grindset Chicken Tendies', 
        description: "Tendies so fire they'll make you question reality",
        ingredients: ['2 lbs chicken tenders (the chosen ones)', '2 cups buttermilk (for marinating like a boss)', '2 cups flour (the coating of champions)', '2 tsp paprika (spice is nice)', '1 tsp garlic powder (vampire repellent)', '1 tsp onion powder (flavor bomb)', '1 tsp cayenne (optional: for those who can handle the heat)', 'Salt and pepper (the basics)', 'Oil for frying (the transformation medium)'], 
        instructions: 'Marinate chicken in buttermilk for at least 2 hours (patience = W)\nMix flour with all spices in a bowl. This is the drip\nHeat oil to 350°F (too hot and you\'ll get cooked, too cold and it\'s mid)\nCoat each tender in flour mixture (double coat if you\'re feeling devious)\nFry for 6-8 mins until golden. They should be giving crispy\nDrain on paper towels (we don\'t need that extra grease)\nServe with your sauce of choice. Absolutely cinema',
        difficulty: 'Moderate grind',
        prepTime: '2 hours 15 mins',
        cookTime: '20 mins'
      },
      { 
        name: 'Fanum Tax Loaded Fries', 
        description: "Loaded fries so good they'll get fanum taxed immediately",
        ingredients: ['2 lbs frozen fries (or make your own if you\'re built different)', '1 lb ground beef (the protein)', '1 packet taco seasoning (spice up your life)', '2 cups shredded cheese (more cheese = more W)', '1 cup sour cream (the cooling agent)', '1/2 cup jalapeños (for the brave)', '1/4 cup green onions (the garnish that matters)', 'Salsa (as much as your heart desires)'], 
        instructions: 'Cook fries according to package until crispy (soggy fries are an L)\nBrown ground beef and add taco seasoning (let it cook down fr)\nLayer fries on a baking sheet (foundation is key)\nAdd beef, cover with cheese (be generous, you deserve it)\nBake at 400°F until cheese melts (5 mins max)\nTop with sour cream, jalapeños, onions, and salsa\nServe immediately before someone fanum taxes your plate',
        difficulty: 'Entry level',
        prepTime: '10 mins',
        cookTime: '25 mins'
      }
    ],
    healthy: [
      { 
        name: 'Gyatt Damn Green Smoothie', 
        description: "A smoothie so healthy it'll have you saying gyatt about your own glow-up",
        ingredients: ['2 cups spinach (the green machine)', '1 banana (for the thickness)', '1 cup frozen mango (tropical vibes)', '1/2 avocado (healthy fats are serving)', '1 cup almond milk (or any milk that slaps)', '1 tbsp chia seeds (the tiny powerhouses)', '1 tbsp honey (natural sweetness fr)', 'Ice cubes (for that chill factor)'], 
        instructions: 'Add spinach and almond milk to blender first (liquid base is key)\nAdd banana, mango, and avocado (the flavor profile)\nToss in chia seeds and honey (boost mode activated)\nAdd ice cubes (depending on how thick you want it)\nBlend until smooth (no chunks allowed in this establishment)\nPour into a glass and drink immediately\nYour skin will be glowing like you just hit a lick',
        difficulty: 'No effort W',
        prepTime: '5 mins',
        cookTime: '0 mins'
      },
      { 
        name: 'Slay Queen Salmon Bowl', 
        description: "A salmon bowl that's giving health and wealth",
        ingredients: ['2 salmon fillets (wild-caught and unbothered)', '2 cups cooked quinoa (the ancient grain)', '2 cups mixed greens (arugula, spinach, whatever\'s popping)', '1 avocado sliced (the creamy goodness)', '1 cup cherry tomatoes halved (bite-sized flavor bombs)', '1/4 cup edamame (protein pods)', '2 tbsp olive oil (liquid gold)', '1 lemon (for the zing)', 'Salt, pepper, garlic powder (the holy trinity)'], 
        instructions: 'Season salmon with salt, pepper, and garlic powder (coat it good)\nHeat olive oil in a pan over medium heat\nCook salmon 4-5 mins per side (don\'t overcook or it\'s cooked)\nWhile salmon cooks, prep your bowls with quinoa base\nAdd greens, tomatoes, edamame, and avocado (arrange it aesthetically)\nPlace salmon on top when done (it\'s giving centerpiece)\nSqueeze lemon over everything (that acid cuts through)\nDrizzle with more olive oil if desired. Absolutely immaculate',
        difficulty: 'Intermediate slay',
        prepTime: '15 mins',
        cookTime: '10 mins'
      },
      { 
        name: 'Mewing-Approved Overnight Oats', 
        description: "Oats so good they'll strengthen your jawline through sheer nutrition",
        ingredients: ['1 cup rolled oats (the base of legends)', '1 cup milk of choice (dairy or plant, your kingdom)', '1/2 cup Greek yogurt (protein packed)', '1 tbsp chia seeds (the expansion pack)', '1 tbsp honey or maple syrup (sweet dreams are made of this)', '1/2 tsp vanilla extract (the vibe)', '1/2 cup berries (strawberries, blueberries, go crazy)', '2 tbsp almond butter (optional but recommended)'], 
        instructions: 'Mix oats, milk, yogurt, chia seeds in a jar (mason jars hit different)\nAdd honey and vanilla (stir it with purpose)\nCover and refrigerate overnight (let time do the work)\nIn the morning, stir and add berries on top\nDrizzle with almond butter (if you\'re feeling devious)\nEat straight from the jar or bowl it up\nYour jawline will thank you (mewing optional but encouraged)',
        difficulty: 'Zero skill required',
        prepTime: '5 mins',
        cookTime: '0 mins (just waiting)'
      }
    ],
    breakfast: [
      { 
        name: 'No Cap Pancake Stack', 
        description: "Pancakes so fluffy they're literally on another level",
        ingredients: ['2 cups flour (all-purpose is clutch)', '2 tbsp sugar (sweetness factor)', '2 tsp baking powder (the rise is real)', '1/2 tsp salt (just a pinch fr)', '2 eggs (the binder)', '1 3/4 cups milk (whole milk slaps)', '1/4 cup melted butter (liquid gold status)', '1 tsp vanilla (the secret ingredient)', 'Butter for pan (the non-stick guardian)'], 
        instructions: 'Mix flour, sugar, baking powder, and salt (the dry squad)\nWhisk eggs, milk, butter, and vanilla separately (the wet crew)\nPour wet into dry and stir until just combined (lumps are okay, chill)\nHeat pan on medium, butter it up (this is crucial)\nPour 1/4 cup batter per pancake (sizing matters)\nCook until bubbles form, then flip (patience is key)\nStack \'em high and serve with syrup. It\'s giving breakfast of champions',
        difficulty: 'Easy W',
        prepTime: '10 mins',
        cookTime: '20 mins'
      },
      { 
        name: "Unc's Legendary Breakfast Burrito", 
        description: "A breakfast burrito that'll have you saying 'what the sigma'",
        ingredients: ['4 large flour tortillas (the wrap game)', '8 eggs scrambled (the protein base)', '1 lb breakfast sausage (the flavor carrier)', '2 cups shredded cheese (never skimp on cheese)', '1 cup diced potatoes (crispy is mandatory)', '1/2 cup diced bell peppers (color and crunch)', '1/4 cup diced onions (flavor depth)', 'Salsa and sour cream (the finishing touch)'], 
        instructions: 'Cook potatoes until crispy (this takes time but it\'s worth it)\nBrown sausage and set aside (drain the grease, we\'re not animals)\nSauté peppers and onions until soft (flavor foundation)\nScramble eggs in the same pan (one pan gang)\nWarm tortillas (microwave 20 secs or pan heat)\nLayer eggs, sausage, potatoes, peppers, onions, cheese\nRoll up tight like you mean it (burrito technique matters)\nOptional: pan fry the burrito for crispy exterior\nServe with salsa and sour cream. Absolutely cinema',
        difficulty: 'Moderate grind',
        prepTime: '15 mins',
        cookTime: '25 mins'
      }
    ],
    snacks: [
      { 
        name: 'Ohio Final Boss Nachos', 
        description: "Nachos so legendary they're the final boss of snack time",
        ingredients: ['1 bag tortilla chips (the foundation)', '2 cups shredded cheese (go wild)', '1 can black beans drained (protein boost)', '1 cup salsa (mild, medium, or spicy - you choose)', '1/2 cup sour cream (the cooling agent)', '1/4 cup jalapeños (optional: only if you\'re built different)', '1/4 cup olives sliced (optional)', '2 green onions sliced (the garnish)', 'Guacamole (homemade or store-bought, no judgment)'], 
        instructions: 'Spread chips on a baking sheet (even distribution is key)\nSprinkle beans evenly over chips (protein placement)\nCover everything with cheese (be generous, you only live once)\nBake at 350°F for 10 mins until cheese melts\nRemove and add dollops of sour cream and salsa\nTop with jalapeños, olives, and green onions\nServe with guac on the side. These are absolutely devious',
        difficulty: 'Entry level',
        prepTime: '5 mins',
        cookTime: '10 mins'
      },
      { 
        name: 'Goated Garlic Bread', 
        description: "Garlic bread that's giving Michelin star energy",
        ingredients: ['1 French baguette (the canvas)', '1/2 cup butter softened (the base)', '4 cloves garlic minced (the star of the show)', '2 tbsp fresh parsley chopped (the green queen)', '1/4 cup parmesan cheese (the umami bomb)', '1/2 tsp salt (the enhancer)', '1/4 tsp black pepper (the spice)'], 
        instructions: 'Preheat oven to 375°F (get that heat going)\nMix butter, garlic, parsley, parmesan, salt, pepper (the spread)\nSlice baguette in half lengthwise (commitment to flavor)\nSpread mixture generously on both halves (don\'t be shy)\nWrap in foil and bake for 10 mins\nUnwrap, broil for 2-3 mins until crispy (watch it closely)\nSlice and serve. Your kitchen will smell absolutely divine',
        difficulty: 'No cap easy',
        prepTime: '10 mins',
        cookTime: '15 mins'
      }
    ]
  };

  const handleFindMatch = () => {
    if (!craving.trim()) return;
    
    setIsSearching(true);
    const searchTerm = craving.toLowerCase().trim();
    let recipes = [];
    
    // Category matching with keywords
    const categoryKeywords: Record<string, string[]> = {
      desserts: ['dessert', 'desserts', 'sweet', 'cake', 'cheesecake'],
      comfort: ['comfort', 'comfort food', 'mac', 'cheese', 'chicken', 'tendies', 'fries', 'loaded'],
      healthy: ['healthy', 'health', 'smoothie', 'salmon', 'bowl', 'oats', 'fit'],
      breakfast: ['breakfast', 'morning', 'pancake', 'pancakes', 'burrito', 'eggs'],
      snacks: ['snack', 'snacks', 'nachos', 'garlic bread', 'quick bite']
    };
    
    // Find matching category
    let foundCategory = null;
    Object.keys(categoryKeywords).forEach((category) => {
      categoryKeywords[category].forEach((keyword: string) => {
        if (searchTerm.includes(keyword)) {
          foundCategory = category;
        }
      });
    });
    
    // Get recipes from matched category
    if (foundCategory && recipeDatabase[foundCategory]) {
      recipes = recipeDatabase[foundCategory];
    } else {
      // If no category match, combine all
      recipes = Object.values(recipeDatabase).flat();
    }
    
    setTimeout(() => {
      setMatchingRecipes(recipes);
      setCurrentRecipeIndex(0);
      setIsSearching(false);
    }, 800);
  };

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (direction === 'right') {
      const recipe = matchingRecipes[currentRecipeIndex];
      setGeneratingImage(true);
      setImageLoaded(false);
      
      try {
        // Generate brainrot text description
        const textResponse = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            messages: [
              { 
                role: "user", 
                content: `Generate a creative, humorous brainrot-style description for this recipe: ${recipe.name}. Make it gen-z coded, chaotic, and funny. Keep it to 2-3 sentences max. Use words like "no cap", "fr fr", "bussin", "slay", etc.`
              }
            ],
          })
        });
        
        const textData = await textResponse.json();
        const brainrotText = textData.content[0]?.text || "This hits different fr fr no cap 🔥💅";
        
        // Create a unique seed for consistent but varied images
        const seed = Math.floor(Math.random() * 1000000);
        
        // Use a simpler, more reliable image generation approach
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(`surreal brainrot meme style ${recipe.name}, neon colors, vaporwave aesthetic, cursed food photography, chaotic energy, glowing, y2k style`)}&seed=${seed}&width=800&height=600&nologo=true`;
        
        setSelectedRecipe({
          ...recipe,
          brainrotDescription: brainrotText,
          imageUrl: imageUrl
        });
        
        setGeneratingImage(false);
      } catch (error) {
        console.error('Error generating:', error);
        const seed = Math.floor(Math.random() * 1000000);
        const fallbackUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(`brainrot ${recipe.name} chaotic neon cursed food`)}&seed=${seed}&width=800&height=600`;
        
        setSelectedRecipe({
          ...recipe,
          brainrotDescription: "POV: you're about to devour this absolute banger no cap fr fr 🔥💅✨",
          imageUrl: fallbackUrl
        });
        setGeneratingImage(false);
      }
    } else {
      // Swipe left - next recipe
      if (currentRecipeIndex < matchingRecipes.length - 1) {
        setCurrentRecipeIndex(currentRecipeIndex + 1);
      } else {
        setMatchingRecipes([]);
        setCraving('');
      }
    }
  };

  const handleAddMeal = () => {
    if (newMeal.name && newMeal.ingredients) {
      setMeals([...meals, { ...newMeal, id: Date.now() }]);
      setNewMeal({ name: '', ingredients: '', tag: '', image: '' });
      setShowAddForm(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = typeof reader.result === 'string' ? reader.result : '';
        setNewMeal({ ...newMeal, image: result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-purple-600 mb-2 flex items-center justify-center gap-2">
            <Sparkles className="text-pink-500" />
            Slay or Decay
            <Sparkles className="text-pink-500" />
          </h1>
          <p className="text-gray-600">✨ cook. cringe. conquer. ✨</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-full p-2 shadow-lg">
          <button
            onClick={() => setActiveTab('meals')}
            className={`flex-1 py-3 px-6 rounded-full font-semibold transition-all ${
              activeTab === 'meals' 
                ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ChefHat className="inline mr-2" size={20} />
            My Meals
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className={`flex-1 py-3 px-6 rounded-full font-semibold transition-all ${
              activeTab === 'community' 
                ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Heart className="inline mr-2" size={20} />
            Match Me
          </button>
        </div>

        {/* Meals Tab */}
        {activeTab === 'meals' && (
          <div className="space-y-4">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Plus size={24} />
              Add New Meal
            </button>

            {showAddForm && (
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <h3 className="text-xl font-bold text-purple-600 mb-4">New Girl Dinner 💅</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Meal name (e.g., Sad Girl Pasta)"
                    value={newMeal.name}
                    onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-400 outline-none text-pink-600 placeholder-pink-400 caret-pink-500"
                  />
                  <textarea
                    placeholder="Ingredients (comma separated)"
                    value={newMeal.ingredients}
                    onChange={(e) => setNewMeal({ ...newMeal, ingredients: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-400 outline-none text-pink-600 placeholder-pink-400 caret-pink-500"
                    rows={3}
                  />
                  <input
                    type="text"
                    placeholder="Tag (e.g., comfort food, quick)"
                    value={newMeal.tag}
                    onChange={(e) => setNewMeal({ ...newMeal, tag: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-400 outline-none text-pink-600 placeholder-pink-400 caret-pink-500"
                  />
                  <div className="border-2 border-dashed border-purple-300 rounded-xl p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="imageUpload"
                    />
                    <label htmlFor="imageUpload" className="cursor-pointer">
                      <Camera className="mx-auto mb-2 text-purple-400" size={32} />
                      <p className="text-gray-600">Click to upload image</p>
                    </label>
                    {newMeal.image && (
                      <img src={newMeal.image} alt="Preview" className="mt-4 max-h-40 mx-auto rounded-lg" />
                    )}
                  </div>
                  <button
                    onClick={handleAddMeal}
                    className="w-full bg-purple-500 text-white py-3 rounded-xl font-semibold hover:bg-purple-600"
                  >
                    Save Meal ✨
                  </button>
                </div>
              </div>
            )}

            <div className="grid gap-4">
              {meals.map(meal => (
                <div key={meal.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                  <div className="flex gap-4">
                    {meal.image && (
                      <img src={meal.image} alt={meal.name} className="w-24 h-24 object-cover rounded-xl" />
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-purple-600">{meal.name}</h3>
                      {meal.tag && (
                        <span className="inline-block bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm mt-2">
                          {meal.tag}
                        </span>
                      )}
                      <p className="text-gray-600 mt-2">{meal.ingredients}</p>
                    </div>
                  </div>
                </div>
              ))}
              {meals.length === 0 && !showAddForm && (
                <div className="text-center py-12 text-gray-400">
                  <ChefHat size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No meals yet bestie! Add your first girl dinner 💕</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Community/Tinder Tab */}
        {activeTab === 'community' && (
          <div className="space-y-6">
            {!matchingRecipes.length && !selectedRecipe && (
              <div className="bg-white rounded-2xl p-8 shadow-xl text-center">
                <h3 className="text-2xl font-bold text-purple-600 mb-4">What are you craving? 👀</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="e.g., dessert, quick snack, comfort food"
                    value={craving}
                    onChange={(e) => setCraving(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleFindMatch()}
                    className="w-full px-6 py-4 border-2 border-purple-200 rounded-xl focus:border-purple-400 outline-none text-lg text-pink-600 placeholder-pink-400 caret-pink-500"
                  />
                  <button
                    onClick={handleFindMatch}
                    disabled={isSearching}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {isSearching ? '✨ Finding your match...' : '💖 Match Me!'}
                  </button>
                </div>
              </div>
            )}

            {matchingRecipes.length > 0 && !selectedRecipe && currentRecipeIndex < matchingRecipes.length && (
              <div className="bg-white rounded-2xl p-8 shadow-2xl">
                <div className="text-center mb-6">
                  <h3 className="text-3xl font-bold text-purple-600 mb-2">
                    {matchingRecipes[currentRecipeIndex].name}
                  </h3>
                  <div className="w-full h-64 bg-gradient-to-br from-pink-200 to-purple-200 rounded-xl mb-6 flex items-center justify-center overflow-hidden">
                    <img 
                      src={`https://image.pollinations.ai/prompt/${encodeURIComponent(`${matchingRecipes[currentRecipeIndex].name} food photography`)}`}
                      alt={matchingRecipes[currentRecipeIndex].name}
                      className="w-full h-full object-cover rounded-xl"
                      onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                        e.currentTarget.src = `https://source.unsplash.com/400x300/?${matchingRecipes[currentRecipeIndex].name.replace(/\s/g, '-')},food`;
                      }}
                    />
                  </div>
                  <p className="text-gray-600 mb-4">
                    {matchingRecipes[currentRecipeIndex].ingredients.join(', ')}
                  </p>
                </div>
                
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => handleSwipe('left')}
                    className="bg-red-500 text-white p-6 rounded-full hover:bg-red-600 transition-all hover:scale-110 shadow-lg"
                  >
                    <X size={32} />
                  </button>
                  <button
                    onClick={() => handleSwipe('right')}
                    className="bg-green-500 text-white p-6 rounded-full hover:bg-green-600 transition-all hover:scale-110 shadow-lg"
                  >
                    <Heart size={32} />
                  </button>
                </div>
                <p className="text-center text-gray-500 mt-4 text-sm">
                  {currentRecipeIndex + 1} / {matchingRecipes.length}
                </p>
              </div>
            )}

            {selectedRecipe && (
              <div className="bg-white rounded-2xl p-8 shadow-2xl">
                <div className="text-center mb-6">
                  <h3 className="text-3xl font-bold text-purple-600 mb-4">It's a Match! 💕</h3>
                  <h4 className="text-2xl font-bold text-gray-800 mb-4">{selectedRecipe.name}</h4>
                  
                  {generatingImage ? (
                    <div className="w-full h-64 bg-gradient-to-br from-pink-200 to-purple-200 rounded-xl mb-6 flex flex-col items-center justify-center">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mb-4"></div>
                      <p className="text-purple-600 font-semibold">Generating brainrot image... ✨</p>
                    </div>
                  ) : (
                    <>
                      <div className="mb-4 p-4 bg-pink-50 rounded-xl">
                        <p className="text-gray-700 italic">{selectedRecipe.brainrotDescription}</p>
                      </div>
                      <div className="relative w-full h-64 bg-gradient-to-br from-pink-200 to-purple-200 rounded-xl mb-6 overflow-hidden">
                        {!imageLoaded && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-600"></div>
                          </div>
                        )}
                        <img 
                          src={selectedRecipe.imageUrl}
                          alt={selectedRecipe.name}
                          className="w-full h-full object-cover rounded-xl"
                          onLoad={() => setImageLoaded(true)}
                          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                            console.log('Image load error, trying fallback');
                            if (!e.currentTarget.src.includes('unsplash')) {
                              e.currentTarget.src = `https://source.unsplash.com/800x600/?${selectedRecipe.name.replace(/\s/g, '-')},food,aesthetic`;
                            }
                            setImageLoaded(true);
                          }}
                        />
                      </div>
                    </>
                  )}
                  
                  <div className="text-left space-y-4">
                    <div>
                      <h5 className="font-bold text-purple-600 mb-2">Ingredients:</h5>
                      <ul className="list-disc list-inside text-gray-700">
                        {selectedRecipe.ingredients.map((ing, i) => (
                          <li key={i}>{ing}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-bold text-purple-600 mb-2">Instructions:</h5>
                      <p className="text-gray-700 whitespace-pre-line">{selectedRecipe.instructions}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      setSelectedRecipe(null);
                      setMatchingRecipes([]);
                      setCraving('');
                    }}
                    className="mt-6 w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl font-semibold"
                  >
                    Find Another Match 💖
                  </button>
                </div>
              </div>
            )}

            {matchingRecipes.length > 0 && currentRecipeIndex >= matchingRecipes.length && !selectedRecipe && (
              <div className="bg-white rounded-2xl p-8 shadow-xl text-center">
                <p className="text-xl text-gray-600 mb-4">No more recipes to show! 😢</p>
                <button
                  onClick={() => {
                    setMatchingRecipes([]);
                    setCraving('');
                  }}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 px-6 rounded-xl font-semibold"
                >
                  Search Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrainrotGirlDinner;