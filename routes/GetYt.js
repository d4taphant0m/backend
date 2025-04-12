import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

const YOUTUBE_API_KEY = process.env.YOUTUBE_KEY;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';

async function fetchYouTubeVideosForTopic(topic, maxResults = 3) {
  try {
    const { data } = await axios.get(YOUTUBE_API_URL, {
      params: {
        part: 'snippet',
        q: `${topic} tutorial`,
        type: 'video',
        maxResults,
        key: YOUTUBE_API_KEY,
      },
    });

    return data.items.map(item => ({
      topic,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      videoId: item.id.videoId,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      thumbnail: item.snippet.thumbnails.medium.url,
    }));
  } catch (err) {
    console.error(`❌ Failed for topic "${topic}":`, err.message);
    return [];
  }
}

router.post('/getvideos', async (req, res) => {
  const topics = req.body.topics || [];
  const maxPerTopic = req.body.max || 3;

  if (!Array.isArray(topics) || topics.length === 0) {
    return res.status(400).json({ error: 'Please provide an array of topics in request body.' });
  }

  const allResults = [];
  for (const topic of topics) {
    console.log(`🔍 Fetching videos for: ${topic}`);
    const videos = await fetchYouTubeVideosForTopic(topic, maxPerTopic);
    allResults.push(...videos);
  }

  console.log(`\n🎥 Fetched a total of ${allResults.length} videos across ${topics.length} topics.\n`);
  res.json(allResults);
});

export default router;