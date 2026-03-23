import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RecipeDetailsPage from './pages/RecipeDetailsPage';

const RECIPE_CACHE_KEY = 'chefsaver_recipes';

export default function App() {
  const [recipes, setRecipes] = useState(() => {
    const cached = localStorage.getItem(RECIPE_CACHE_KEY);
    if (!cached) return [];
    try {
      return JSON.parse(cached);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(RECIPE_CACHE_KEY, JSON.stringify(recipes));
  }, [recipes]);

  return (
    <Routes>
      <Route
        path="/"
        element={<HomePage recipes={recipes} onRecipesChange={setRecipes} />}
      />
      <Route
        path="/recipes/:recipeIndex"
        element={<RecipeDetailsPage recipes={recipes} />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}