# ChefSaver (Production-Ready, Free & Vercel-Native)

ChefSaver is a full-stack recipe suggestion app that helps users discover meals they can prepare using the ingredients they already have at home. It runs fully on Vercel with **no paid AI APIs**.

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
# ChefSaver (Full-Stack Recipe Generator)

ChefSaver is a full-stack web app where users enter available ingredients and get meal suggestions.

## Tech Stack
- **Frontend:** React + Vite + React Router
- **Backend:** Node.js + Express
- **AI:** OpenAI API

## Features
- Ingredient input with validation
- Loading spinner while recipes are generated
- Recipe cards with meal name and cooking time
- Recipe details page (ingredients + instructions)
- Backend endpoint `POST /recipes`
- Error handling on both frontend and backend
- Mobile-first responsive UI

## Project Structure
```text
chefsaver/
├── api/
│   ├── _lib/
│   │   └── recipeStore.js
│   ├── health.js
│   └── recipes.js
├── data/
│   └── recipes.json
├── backend/
│   ├── .env.example
│   ├── package.json
│   └── server.js
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

If your Vercel project still has a custom install command set to `npm run install:all`, that now works too.

`vercel.json` is configured to:
- Build frontend
- Expose API functions under `/api/*`
- Support SPA routing fallback to `index.html`
## Deploy to Vercel
1. Push this repo to GitHub.
2. Import the repo in Vercel.
3. Deploy (no paid APIs or keys required).

`vercel.json` is already configured to:
- Build frontend to `frontend/dist`
- Serve API from `/api/*`
- Support SPA routes via fallback to `index.html`

## Commands
```bash
# install frontend deps
npm run install:all

# run frontend locally
npm run dev:frontend

# build frontend (+ sync to root /dist)
npm run build
# build frontend
npm run build
└── README.md
```

## Prerequisites
- Node.js 18+
- npm 9+
- OpenAI API key

## 1) Install Dependencies
From the repo root:

```bash
cd backend && npm install
cd ../frontend && npm install
```

## 2) Configure Environment Variables

### Backend
```bash
cd backend
cp .env.example .env
```
Open `backend/.env` and set:
- `OPENAI_API_KEY=...` (required)
- `OPENAI_MODEL=gpt-4.1-mini` (optional)
- `PORT=3001` (optional)

### Frontend
```bash
cd frontend
cp .env.example .env
```
Open `frontend/.env` and set:
- `VITE_API_BASE_URL=http://localhost:3001`

## 3) Run the App
Use two terminals.

### Terminal A (Backend)
```bash
cd backend
npm run dev
```

### Terminal B (Frontend)
```bash
cd frontend
npm run dev
```

Then open:
- Frontend: `http://localhost:5173`
- Backend health check: `http://localhost:3001/health`

## API Contract
### `POST /recipes`
Request body:
```json
{
  "ingredients": "rice, eggs, tomatoes"
}
```

Response body:
```json
{
  "recipes": [
    {
      "name": "Meal name",
      "ingredients": ["ingredient1", "ingredient2"],
      "instructions": ["step 1", "step 2"],
      "cooking_time": "25 minutes"
    }
  ]
}
```

## Commands to Run the App
```bash
# Install all dependencies
cd backend && npm install
cd ../frontend && npm install

# Run backend (terminal 1)
cd backend && npm run dev

# Run frontend (terminal 2)
cd frontend && npm run dev
```
