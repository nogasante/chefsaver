# SmartChef (Production-Ready, Free & Vercel-Native)

SmartChef is a full-stack Ghanaian recipe suggestion app that runs fully on Vercel with **no paid AI APIs**.

## What changed
- Removed all OpenAI/AI integration.
- Added a deterministic ingredient matching engine.
- Added a local Ghanaian recipe dataset (`/data/recipes.json`) with 30+ recipes.
- Kept API serverless and fast via Vercel Functions.

## Tech Stack
- **Frontend:** React + Vite + React Router
- **Backend:** Vercel Serverless Functions (`/api`)
- **Data:** Local JSON dataset

## Features
- Ingredient input with validation
- Category filter (bonus)
- Ingredient suggestions/autocomplete (bonus)
- Match scoring and ranking
- Best match badge + matched ingredient highlighting (bonus)
- Loading, error, and empty states
- Mobile-first UI

## Project Structure
```text
smartchef/
├── api/
│   ├── _lib/
│   │   └── recipeStore.js
│   ├── health.js
│   └── recipes.js
├── data/
│   └── recipes.json
├── frontend/
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── styles.css
│       ├── components/
│       │   ├── LoadingSpinner.jsx
│       │   └── RecipeCard.jsx
│       └── pages/
│           ├── HomePage.jsx
│           └── RecipeDetailsPage.jsx
├── package.json
├── vercel.json
└── README.md
```

## Matching Engine (How it works)
1. Parse comma-separated input ingredients.
2. Normalize text (trim, lowercase, punctuation cleanup).
3. Compare user ingredients against each recipe ingredient with fuzzy includes + singularization.
4. Compute `score = matched_ingredients / total_recipe_ingredients`.
5. Filter low-quality matches (`score < 0.2`).
6. Rank by score and matched count.
7. Return top 8 recipes.

## API Endpoints
### `POST /api/recipes`
Request body:
```json
{
  "ingredients": "rice, tomatoes, onion",
  "category": "all"
}
```

Success response:
```json
{
  "recipes": [],
  "error": null
}
```

Error response:
```json
{
  "recipes": [],
  "error": "message"
}
```

### `GET /api/health`
Response:
```json
{ "status": "ok" }
```

## Local Development
```bash
npm run install:all
npm run dev:frontend
```

> For full local serverless emulation, use `npm run dev` (runs `vercel dev`) if Vercel CLI is installed.

## Deploy to Vercel (Fix for install/build errors)
If you import from GitHub and choose **Root Directory = `frontend`**, deployment now works because:
- `frontend/package.json` includes `install:all`
- `vercel.json` uses plain `npm install`
- output directory is `dist`

Recommended settings:
- Framework Preset: **Vite**
- Root Directory: **frontend** (or repo root)
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

`vercel.json` is configured to:
- Build frontend
- Expose API functions under `/api/*`
- Support SPA routing fallback to `index.html`

## Commands
```bash
# install frontend deps
npm run install:all

# run frontend locally
npm run dev:frontend

# build frontend (+ sync to root /dist)
npm run build
```
