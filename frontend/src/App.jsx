import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const RECIPE_CACHE_KEY = 'smartchef_recipes';

class App extends React.Component {
  componentDidMount() {
    const cachedRecipes = localStorage.getItem(RECIPE_CACHE_KEY);
    if (cachedRecipes) {
      // Restore from cache
    }
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" exact component={HomePage} />
          <Route path="/recipe/:id" component={RecipeDetailsPage} />
        </Switch>
      </Router>
    );
  }
}

export default App;