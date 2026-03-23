import { Link, Navigate, useParams } from 'react-router-dom';

export default function RecipeDetailsPage({ recipes }) {
  const { recipeIndex } = useParams();
  const selectedRecipe = recipes[Number(recipeIndex)];

  if (!selectedRecipe) {
    return <Navigate to="/" replace />;
  }

  const matchedSet = new Set(selectedRecipe.matchedIngredients || []);

  return (
    <main className="page-container">
      <section className="details-card">
        <Link to="/" className="back-link">
          ← Back to recipes
        </Link>
        <h1>{selectedRecipe.name}</h1>
        <p className="cooking-time">
          <span>Cooking Time:</span> {selectedRecipe.cooking_time}
        </p>

        <h2>Ingredients</h2>
        <ul>
          {selectedRecipe.ingredients.map((item) => (
            <li key={item} className={matchedSet.has(item) ? 'matched-ingredient' : ''}>
              {item}
              {matchedSet.has(item) && <strong> (matched)</strong>}
            </li>
          ))}
        </ul>

        <h2>Instructions</h2>
        <ol>
          {selectedRecipe.instructions.map((step, index) => (
            <li key={`${step}-${index}`}>{step}</li>
          ))}
        </ol>
      </section>
    </main>
  );
}
