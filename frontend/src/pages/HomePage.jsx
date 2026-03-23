import { useMemo, useState } from 'react';
import RecipeCard from '../components/RecipeCard';
import LoadingSpinner from '../components/LoadingSpinner';

const CATEGORY_OPTIONS = [
  { label: 'All categories', value: 'all' },
  { label: 'Rice', value: 'rice' },
  { label: 'Soup', value: 'soup' },
  { label: 'Stew', value: 'stew' },
  { label: 'Beans', value: 'beans' },
  { label: 'Yam', value: 'yam' },
  { label: 'Quick Meals', value: 'quick' },
  { label: 'Vegetarian', value: 'vegetarian' },
  { label: 'Swallow', value: 'swallow' }
];

const INGREDIENT_SUGGESTIONS = [
  'rice',
  'tomatoes',
  'onion',
  'pepper',
  'garlic',
  'ginger',
  'yam',
  'plantain',
  'beans',
  'okra',
  'eggs',
  'tilapia'
];

export default function HomePage({ recipes, onRecipesChange }) {
  const [ingredients, setIngredients] = useState('');
  const [category, setCategory] = useState('all');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const suggestions = useMemo(() => INGREDIENT_SUGGESTIONS.join(', '), []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedIngredients = ingredients.trim();

    if (!trimmedIngredients) {
      setError('Please add at least one ingredient before searching.');
      setHasSubmitted(true);
      return;
    }

    setError('');
    setIsLoading(true);
    setHasSubmitted(true);

    try {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ingredients: trimmedIngredients, category })
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Unable to fetch recipes right now.');
      }

      onRecipesChange(data.recipes || []);
    } catch (requestError) {
      setError(requestError.message || 'Something went wrong. Please try again.');
      onRecipesChange([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="page-container">
      <section className="hero-card">
        <h1>SmartChef</h1>
        <p>Find Ghanaian meals from ingredients already in your kitchen.</p>

        <form onSubmit={handleSubmit} className="ingredient-form">
          <label htmlFor="ingredients">Ingredients</label>
          <input
            id="ingredients"
            type="text"
            list="ingredient-suggestions"
            placeholder="Enter ingredients (e.g., rice, eggs, tomatoes)"
            value={ingredients}
            onChange={(event) => setIngredients(event.target.value)}
          />
          <datalist id="ingredient-suggestions">
            {INGREDIENT_SUGGESTIONS.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>

          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Find Recipes'}
          </button>
        </form>

        <p className="helper-text">Try: {suggestions}</p>

        {error && <p className="error-message">{error}</p>}
      </section>

      {isLoading && <LoadingSpinner />}

      {hasSubmitted && !isLoading && !error && recipes.length === 0 && (
        <p className="empty-state">No recipes found. Try adding more ingredients.</p>
      )}

      {!!recipes.length && !isLoading && (
        <section className="results-grid" aria-label="Recipe suggestions">
          {recipes.map((recipe, index) => (
            <RecipeCard key={`${recipe.name}-${index}`} recipe={recipe} index={index} />
          ))}
        </section>
      )}
    </main>
  );
}
