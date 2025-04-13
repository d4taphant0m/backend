import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.API_KEY || '');

router.post('/generate-study-roadmap', async (req, res) => {
  const { topics } = req.body;

  if (!topics || !Array.isArray(topics) || topics.length === 0) {
    return res.status(400).json({ error: 'Missing or invalid topics array' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });


    const prompt = `
Generate a step-by-step study roadmap for the following topics: ${topics.join(', ')}.

The roadmap should be structured logically, gradually introducing these topics and building up the learner's understanding. Use around 10 to 12 steps total.

Return the roadmap as a JSON array in the following format:

[
  {
    "step": 1,
    "title": "Phase title or subtopic",
    "topics": ["Topic A", "Topic B"], 
    "resources": [
      "https://link1.com",
      "https://link2.com"
    ]
  },
  ...
]

Only return the raw JSON array and nothing else.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonStart = text.indexOf('[');
    const jsonEnd = text.lastIndexOf(']');
    const jsonString = text.slice(jsonStart, jsonEnd + 1);

    const roadmap = JSON.parse(jsonString);

    res.json({ roadmap });
  } catch (err) {
    console.error('Gemini Error:', err);
    res.status(500).json({ error: 'Failed to generate roadmap' });
  }
});

export default router;
