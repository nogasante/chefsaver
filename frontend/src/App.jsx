import { Navigate, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import HomePage from './pages/HomePage';
import RecipeDetailsPage from './pages/RecipeDetailsPage';

export default function App() {
  // Store recipes in top-level state so details page can read selected recipes.
  const [recipes, setRecipes] = useState([]);

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
