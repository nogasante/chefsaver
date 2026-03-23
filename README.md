# SmartChef (Full-Stack Recipe Generator)

SmartChef is a full-stack web app where users enter available ingredients and get 3 AI-generated meal suggestions.

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
smartchef/
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
