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
    const prompt = `You are an expert technical writer. Generate structured and informative documentation for the topic "${topic}". Format it using these sections:
  
  Topic: ${topic}
  
  1. **Introduction** - What is this topic? Why is it important?
  2. **Key Concepts** - Important terms or ideas people should understand.
  3. **Common Tools or Libraries**
  4. **Use Cases**
  5. **Getting Started Tips**`;
  
    try {
      const response = await fetch(URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });
  
      const data = await response.json();
      console.log(`🔍 [${topic}] Raw Gemini Response:\n`, JSON.stringify(data, null, 2));
  
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      return {
        topic,
        content: text || 'No AI response received.',
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
    const topics = req.body.topics || [];
    if (!Array.isArray(topics) || topics.length === 0) {
      return res.status(400).json({ error: 'Missing or invalid topics array.' });
    }
  
    const results = await Promise.all(topics.map(generateAIDoc));
    
    // ✅ Explicitly set CORS header here (in case Vercel behaves oddly with nested routers)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({ ai_documentation: results });
  });
  
  export default router;
  
