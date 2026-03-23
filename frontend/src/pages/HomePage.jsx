import { useState } from 'react';
import RecipeCard from '../components/RecipeCard';
import LoadingSpinner from '../components/LoadingSpinner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export default function HomePage({ recipes, onRecipesChange }) {
  const [ingredients, setIngredients] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedIngredients = ingredients.trim();

    // Basic validation: don't submit if the field is empty.
    if (!trimmedIngredients) {
      setError('Please add at least one ingredient before submitting.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/recipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ingredients: trimmedIngredients })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to generate recipes right now.');
      }

      onRecipesChange(data.recipes);
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
        <p>Tell SmartChef what you have, and get meal ideas instantly.</p>

        <form onSubmit={handleSubmit} className="ingredient-form">
          <label htmlFor="ingredients">Ingredients</label>
          <input
            id="ingredients"
            type="text"
            placeholder="Enter ingredients (e.g., rice, eggs, tomatoes)"
            value={ingredients}
            onChange={(event) => setIngredients(event.target.value)}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Get Recipes'}
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}
      </section>

      {isLoading && <LoadingSpinner />}

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
