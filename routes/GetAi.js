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

async function generateAIDoc(topic) {
    const prompt = `
  You are a helpful technical explainer. Write short, simple, and easy-to-understand documentation (around 30–35 lines total) for the topic: "${topic}".
  
  Use the following structure. Keep each section short (10-11 lines max):
  
  Topic: ${topic}
  
  1. **Introduction** – What is this topic? Why does it matter?
  2. **Key Concepts** – List and briefly explain 2–3 important ideas.
  3. **Common Tools or Libraries** – Name and explain 2–3 common tools.
  4. **Use Cases** – Give 2–3 practical examples of how this is used.
  5. **Getting Started Tips** – Simple tips for a beginner to start learning.
  
  Use markdown formatting with headings and bullet points. Be concise and beginner-friendly.
  `;
  
    try {
      const response = await fetch(URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });
  
      const data = await response.json();
      console.log(`🔍 [${topic}] Full Gemini Response:\n`, JSON.stringify(data, null, 2));
  
      if (!data?.candidates || data.candidates.length === 0) {
        return {
          topic,
          content: '❌ Gemini API returned no candidates.',
          error: 'Empty response from Gemini.',
        };
      }
  
      const parts = data.candidates[0]?.content?.parts;
      const text = parts?.[0]?.text || '❌ No text in response parts.';
  
      return {
        topic,
        content: text,
      };
    } catch (err) {
      console.error(`❌ [${topic}] Error:`, err.message);
      return {
        topic,
        error: err.message,
      };
    }
  }
  
  

  router.post('/generate-ai-docs', async (req, res) => {
    console.log('📥 /generate-ai-docs HIT');
    const topics = req.body.topics || [];
    console.log('🧠 Topics:', topics);
  
    if (!Array.isArray(topics) || topics.length === 0) {
      return res.status(400).json({ error: 'Missing or invalid topics array.' });
    }
  
    const results = await Promise.all(topics.map(generateAIDoc));
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({ ai_documentation: results });
  });
  
  
  export default router;
  
