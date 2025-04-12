import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const API_KEY = process.env.API_KEY;
const MODEL = 'gemini-2.0-flash';
const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

// Use POST instead of GET to receive JSON body
router.get('/get-subtopics', async (req, res) => {
  const { topic } = req.body;

  const prompt = `List all the important subtopics and skills to be covered under the topic: "${topic}". 
  Return ONLY a JSON array like:
  [
    "subtopic 1",
    "subtopic 2",
    ...
  ]
  Do NOT return any explanation, markdown, or extra formatting. Only raw JSON array.`;

  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      }),
    });

    const data = await response.json();

    if (!data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error("❌ No valid content returned:\n", JSON.stringify(data, null, 2));
      return res.status(500).json({ error: 'No valid content returned from Gemini.' });
    }

    const rawText = data.candidates[0].content.parts[0].text;
    const cleaned = rawText.replace(/```json|```/g, '').trim();

    try {
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) {
        console.log('✅ Subtopics:', parsed);
        return res.json(parsed);
      } else {
        throw new Error('Returned result is not a JSON array.');
      }
    } catch (err) {
      console.error('❌ Failed to parse JSON:', err.message);
      return res.status(500).json({ error: 'Failed to parse JSON from Gemini response.' });
    }

  } catch (err) {
    console.error('❌ Request failed:', err.message);
    return res.status(500).json({ error: 'Request to Gemini API failed.' });
  }
});

export default router;
