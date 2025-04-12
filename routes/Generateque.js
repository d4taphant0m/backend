// /routes/generate-interview-questions.ts

import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.API_KEY || '');

router.post('/generate-interview-questions', async (req, res) => {
  const { topic } = req.body;

  if (!topic) {
    return res.status(400).json({ error: 'Missing topic' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `
Generate exactly 3 beginner, 3 intermediate, and 3 advanced interview questions and answers about "${topic}".
Return as a JSON array like:
[
  {
    "id": "q1",
    "question": "...",
    "answer": "...",
    "difficulty": "Beginner" // or Intermediate or Advanced
  },
  ...
]
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to parse the JSON from response text
    const jsonStart = text.indexOf('[');
    const jsonEnd = text.lastIndexOf(']');
    const jsonString = text.slice(jsonStart, jsonEnd + 1);
    const questions = JSON.parse(jsonString);

    res.json({ questions });
  } catch (err) {
    console.error('Gemini Error:', err);
    res.status(500).json({ error: 'Failed to generate interview questions' });
  }
});

export default router;
