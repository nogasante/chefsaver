import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/recipes', async (req, res) => {
  const { ingredients } = req.body;

  if (!ingredients || !String(ingredients).trim()) {
    return res.status(400).json({
      error: 'Ingredients are required. Please provide at least one ingredient.'
    });
  }

  const prompt = `I have the following ingredients: ${ingredients}.
Suggest 3 meals I can prepare.

Return ONLY in JSON format like this:
[
  {
    "name": "Meal name",
    "ingredients": ["ingredient1", "ingredient2"],
    "instructions": ["step 1", "step 2", "step 3"],
    "cooking_time": "time in minutes"
  }
]`;

  try {
    // Ask OpenAI for recipe suggestions and require strict JSON output.
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful chef assistant. Return valid JSON only.'
        },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' }
    });

    const content = completion.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content was returned from the AI model.');
    }

    const parsed = JSON.parse(content);

    // Accept either { recipes: [...] } or direct array response.
    const recipes = Array.isArray(parsed) ? parsed : parsed.recipes;

    if (!Array.isArray(recipes)) {
      throw new Error('AI response was not in the expected recipe format.');
    }

    return res.json({ recipes });
  } catch (error) {
    console.error('Recipe generation failed:', error);

    return res.status(500).json({
      error:
        'Sorry, we could not generate recipes right now. Please try again in a moment.'
    });
  }
});

app.get('/health', (_, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`ChefSaver backend is running on http://localhost:${PORT}`);
});
