import express from 'express';
import serverless from 'serverless-http';

const app = express();

// Basic GET route
app.get('/', (req, res) => {
  res.send('Hello from Express running as a Vercel serverless function!');
});

// Optional: Catch-all route
app.all('*', (req, res) => {
  res.status(404).send(`Route ${req.originalUrl} not found.`);
});

// Export the app for Vercel
export default serverless(app);
