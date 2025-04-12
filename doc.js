// File: fetchDocs.js
// Node.js script to fetch documentation data using GitHub API and DevDocs Search (no scraping)

import fetch from 'node-fetch';

const topics = [
  'react',
  'machine learning',
  'prompt engineering',
  'python',
  'docker'
];

// Fetch README from GitHub for most starred repo related to topic
async function fetchGithubReadme(topic) {
  const searchUrl = `https://api.github.com/search/repositories?q=${encodeURIComponent(
    topic
  )}&sort=stars&order=desc&per_page=1`;

  try {
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();
    const repo = searchData.items?.[0];

    if (!repo) return { topic, readme: 'No repo found for this topic.' };

    const readmeUrl = `https://api.github.com/repos/${repo.full_name}/readme`;
    const readmeRes = await fetch(readmeUrl, {
      headers: { Accept: 'application/vnd.github.v3.raw' }
    });
    const readmeText = await readmeRes.text();

    return {
      topic,
      repo: repo.full_name,
      url: repo.html_url,
      readme: readmeText.substring(0, 1000) + '...' // first 1k chars
    };
  } catch (err) {
    return { topic, error: err.message };
  }
}

// DevDocs fallback search URL (no true API)
function getDevDocsSearchUrl(topic) {
  return `https://devdocs.io/#q=${encodeURIComponent(topic)}`;
}

// Run the fetch
(async () => {
  console.log('📘 Fetching documentation from GitHub + DevDocs links...');

  const results = await Promise.all(topics.map(fetchGithubReadme));

  for (const result of results) {
    console.log(`\n📚 [${result.topic}]`);
    if (result.repo) {
      console.log(`🔗 GitHub Repo: ${result.repo}`);
      console.log(`🌍 URL: ${result.url}`);
    }
    console.log(`🔎 DevDocs Search: ${getDevDocsSearchUrl(result.topic)}`);
    console.log(`📄 Preview: ${result.readme?.substring(0, 300)}...`);
  }
})();
