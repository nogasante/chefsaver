import { Link } from 'react-router-dom';

export default function RecipeCard({ recipe, index }) {
  return (
    <Link className="recipe-card" to={`/recipes/${index}`}>
      <h3>{recipe.name}</h3>
      <p>
        <span>Cooking Time:</span> {recipe.cooking_time}
      </p>
    </Link>
  );
}
