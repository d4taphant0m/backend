import express from 'express';
import fetch from "node-fetch";

const app = express();
const router = express.Router();

import dotenv from 'dotenv';
dotenv.config();


const API_KEY =process.env.API_KEY;
const MODEL = "gemini-2.0-flash";
const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

async function getStructuredTopicAnalysis(topic, priorKnowledgeParagraph) {
  
}

router.post('/getknowledge', async (req,res)=>{
    const {topic ,knowledgepara} =  req.body;
    const prompt = `You are an AI assistant that helps people learn about technical topics by analyzing what they already know and giving personalized study advice.

    Return a JSON object with two main keys: "input" and "output".

    Use this input:

    "Topic: ${topic}

    Here is what I already know:
    ${knowledgepara}

    Please help me by:
    1. Listing all the important subtopics and skills I should cover under ${topic}.
    2. Identifying the knowledge gaps based on what I already know.
    3. Suggesting a personalized study roadmap."

    Your output should be a JSON object like this:
    {
    "input": "...",
    "output": {
        "all_topics": [ ... ],
        "covered_topics": [ ... ],
        "gap_topics": [ ... ],
        "study_roadmap": [ ... ]
    }
    }

    Return ONLY the JSON object. No explanation, no markdown formatting.`;
    try {
        const response = await fetch(URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
          return;
        }
    
        const rawText = data.candidates[0].content.parts[0].text;
        console.log("📦 Raw Gemini Output:\n", rawText);
    
        try {
          const cleaned = rawText.replace(/```json|```/g, "").trim();
          const parsed = JSON.parse(cleaned);
          console.log("✅ Parsed JSON:\n", parsed);
          res.json(parsed)
        } catch (err) {
          console.error("❌ Failed to parse JSON:", err.message);
        }
    
      } catch (err) {
        console.error("❌ Request failed:", err.message);
      }

});
export default router;
