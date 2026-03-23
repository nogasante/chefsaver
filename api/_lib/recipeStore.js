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

function prepareRecipe(recipe) {
  return {
    ...recipe,
    tokenizedIngredients: recipe.ingredients.map(tokenizeIngredient),
    normalizedCategory: normalizeWord(recipe.category)
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

function scoreRecipe(recipe, userTokensList) {
  let matchedCount = 0;
  const matchedIngredients = [];

  for (let i = 0; i < recipe.ingredients.length; i++) {
    const recipeTokens = recipe.tokenizedIngredients[i];
    if (!recipeTokens.length) {
      continue;
    }

    const isMatched = userTokensList.some((userTokens) =>
      userTokens.some((userToken) =>
        recipeTokens.some(
          (recipeToken) =>
            recipeToken.includes(userToken) || userToken.includes(recipeToken)
        )
      )
    );

    if (isMatched) {
      matchedCount += 1;
      matchedIngredients.push(recipe.ingredients[i]);
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

  const userTokensList = userIngredients.map(tokenizeIngredient);
  const categoryFilter = normalizeWord(category);
  const recipes = getRecipes();

  const filteredByCategory =
    categoryFilter && categoryFilter !== 'all'
      ? recipes.filter((recipe) => recipe.normalizedCategory === categoryFilter)
      : recipes;

  const ranked = filteredByCategory
    .map((recipe) => scoreRecipe(recipe, userTokensList))
    .filter((recipe) => recipe.score >= minScore)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return b.matchedCount - a.matchedCount;
    })
    .slice(0, limit)
    .map(({ tokenizedIngredients, normalizedCategory, ...recipe }) => recipe);

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
