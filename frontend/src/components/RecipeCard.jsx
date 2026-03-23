import { Link } from 'react-router-dom';

export default function RecipeCard({ recipe, index }) {
  return (
    <Link className="recipe-card" to={`/recipes/${index}`}>
      <div className="recipe-header">
        <h3>{recipe.name}</h3>
        {recipe.isBestMatch && <span className="badge">Best Match</span>}
      </div>
      <p>
        <span>Cooking Time:</span> {recipe.cooking_time}
      </p>
      <p>
        <span>Category:</span> {recipe.category || 'general'}
      </p>
      <p>
        <span>Match Score:</span> {Math.round((recipe.score || 0) * 100)}%
      </p>
    </Link>
  );
}
