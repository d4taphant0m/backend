import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import cors from 'cors';

const app = express();
app.use(cors());
dotenv.config();

const router = express.Router();
router.use(express.json());

const API_KEY = process.env.API_KEY;
const MODEL = 'gemini-2.0-flash';
const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

// Prompt builder for generating project ideas
const promptForProjects = (topic) => `
You are a creative project generator. Suggest **one realistic project idea** for a beginner who wants to learn "${topic}". Format it as a JSON object like this:

{
  "id": 1,
  "title": "Build a Todo List App",
  "description": "Create a simple todo list application using vanilla JavaScript.",
  "difficulty": "Beginner",
  "skills": ["DOM Manipulation", "Event Handling", "Local Storage"],
  "url": "#"
}

Only return the JSON object. Do not include explanations or extra text.
`;

async function fetchProject(topic, index) {
  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptForProjects(topic) }] }],
      }),
    });

    const data = await response.json();
    console.log(`📦 [${topic}] Project Response:\n`, JSON.stringify(data, null, 2));

    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    const jsonMatch = rawText?.match(/\{[\s\S]*\}/);
    const project = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

    return project
      ? { ...project, id: index + 1, topic }
      : { id: index + 1, topic, error: '❌ Invalid JSON format from Gemini.' };
  } catch (err) {
    console.error(`❌ Error generating project for "${topic}":`, err.message);
    return {
      id: index + 1,
      topic,
      error: err.message,
    };
  }
}

// POST /generate-projects
router.post('/generate-projects', async (req, res) => {
  console.log('📥 /generate-projects HIT');
  const topics = req.body.topics || [];
  console.log('🧠 Gap Topics:', topics);

  if (!Array.isArray(topics) || topics.length === 0) {
    return res.status(400).json({ error: 'Missing or invalid topics array.' });
  }

  const projects = await Promise.all(topics.map((topic, idx) => fetchProject(topic, idx)));
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json({ projects });
});

export default router;
