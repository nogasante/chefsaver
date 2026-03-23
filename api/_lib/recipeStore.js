const fs = require('node:fs');
const path = require('node:path');

const DATA_PATH = path.join(process.cwd(), 'data', 'recipes.json');
let cachedRecipes = null;

function normalizeWord(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function singularize(word) {
  if (word.endsWith('ies')) {
    return `${word.slice(0, -3)}y`;
  }
  if (word.endsWith('es') && word.length > 4) {
    return word.slice(0, -2);
  }
  if (word.endsWith('s') && word.length > 3) {
    return word.slice(0, -1);
  }
  return word;
}

function tokenizeIngredient(value) {
  const cleaned = normalizeWord(value);
  if (!cleaned) {
    return [];
  }

  return cleaned
    .split(' ')
    .map((token) => singularize(token))
    .filter(Boolean);
}

function ingredientMatches(userIngredient, recipeIngredient) {
  const userTokens = tokenizeIngredient(userIngredient);
  const recipeTokens = tokenizeIngredient(recipeIngredient);

  if (!userTokens.length || !recipeTokens.length) {
    return false;
  }

  return userTokens.some((userToken) =>
    recipeTokens.some(
      (recipeToken) =>
        recipeToken.includes(userToken) || userToken.includes(recipeToken)
    )
  );
}

function prepareRecipe(recipe) {
  return {
    ...recipe,
    normalizedIngredients: recipe.ingredients.map((item) => normalizeWord(item))
  };
}

function getRecipes() {
  if (cachedRecipes) {
    return cachedRecipes;
  }

  const fileBuffer = fs.readFileSync(DATA_PATH, 'utf8');
  const parsed = JSON.parse(fileBuffer);

  cachedRecipes = parsed.map(prepareRecipe);
  return cachedRecipes;
}

function parseUserIngredients(rawIngredients) {
  return String(rawIngredients || '')
    .split(',')
    .map((item) => normalizeWord(item))
    .filter(Boolean);
}

function scoreRecipe(recipe, userIngredients) {
  let matchedCount = 0;
  const matchedIngredients = [];

  for (const recipeIngredient of recipe.ingredients) {
    const isMatched = userIngredients.some((userIngredient) =>
      ingredientMatches(userIngredient, recipeIngredient)
    );

    if (isMatched) {
      matchedCount += 1;
      matchedIngredients.push(recipeIngredient);
    }
  }

  const score = matchedCount / recipe.ingredients.length;

  return {
    ...recipe,
    score,
    matchedCount,
    matchedIngredients,
    isBestMatch: false
  };
}

function findMatchingRecipes({ ingredients, category = 'all', limit = 8, minScore = 0.2 }) {
  const userIngredients = parseUserIngredients(ingredients);

  if (!userIngredients.length) {
    return [];
  }

  const categoryFilter = normalizeWord(category);
  const recipes = getRecipes();

  const filteredByCategory =
    categoryFilter && categoryFilter !== 'all'
      ? recipes.filter((recipe) => normalizeWord(recipe.category) === categoryFilter)
      : recipes;

  const ranked = filteredByCategory
    .map((recipe) => scoreRecipe(recipe, userIngredients))
    .filter((recipe) => recipe.score >= minScore)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return b.matchedCount - a.matchedCount;
    })
    .slice(0, limit)
    .map(({ normalizedIngredients, ...recipe }) => recipe);

  if (ranked[0]) {
    ranked[0].isBestMatch = true;
  }

  return ranked;
}

module.exports = {
  findMatchingRecipes,
  getRecipes,
  parseUserIngredients
};
