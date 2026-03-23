const { findMatchingRecipes } = require('./_lib/recipeStore');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ recipes: [], error: 'Method not allowed.' });
  }

  let body = req.body || {};
  if (typeof req.body === 'string') {
    try {
      body = JSON.parse(req.body || '{}');
    } catch {
      return res.status(400).json({
        recipes: [],
        error: 'Invalid JSON body.'
      });
    }
  }

  const { ingredients, category = 'all' } = body;

  if (!ingredients || !String(ingredients).trim()) {
    return res.status(400).json({
      recipes: [],
      error: 'Ingredients are required. Please provide at least one ingredient.'
    });
  }

  try {
    const recipes = findMatchingRecipes({
      ingredients,
      category,
      limit: 8,
      minScore: 0.2
    });

    return res.status(200).json({
      recipes,
      error: null
    });
  } catch (error) {
    console.error('Recipe matching failed:', error);

    return res.status(500).json({
      recipes: [],
      error: 'Unable to fetch recipes right now. Please try again shortly.'
    });
  }
};
