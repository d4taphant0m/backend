// File: routes/docs.js
import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

// 🔹 GitHub README Fetch
async function fetchGithubReadme(topic) {
  const searchUrl = `https://api.github.com/search/repositories?q=${encodeURIComponent(topic)}&sort=stars&order=desc&per_page=1`;

  try {
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();
    const repo = searchData.items?.[0];

    if (!repo) {
      return { topic, readme: null, github: null, devdocs: getDevDocsUrl(topic) };
    }

    const readmeUrl = `https://api.github.com/repos/${repo.full_name}/readme`;
    const readmeRes = await fetch(readmeUrl, {
      headers: { Accept: 'application/vnd.github.v3.raw' },
    });

    const readmeText = await readmeRes.text();

    return {
      topic,
      github: {
        repo: repo.full_name,
        url: repo.html_url,
      },
      devdocs: getDevDocsUrl(topic),
      readme: readmeText.substring(0, 1000) + '...',
    };
  } catch (err) {
    return {
      topic,
      error: err.message,
      github: null,
      devdocs: getDevDocsUrl(topic),
    };
  }
}

// 🔹 DevDocs Search Link
function getDevDocsUrl(topic) {
  return `https://devdocs.io/#q=${encodeURIComponent(topic)}`;
}

// 🔹 POST endpoint
router.post('/fetch-docs', async (req, res) => {
  const topics = req.body.topics || [];
  if (!Array.isArray(topics) || topics.length === 0) {
    return res.status(400).json({ error: 'Missing or invalid topics array.' });
  }

  const results = await Promise.all(topics.map(fetchGithubReadme));
  res.json({ documentation: results });
});

export default router;
