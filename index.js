import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Home route
app.get('/', (req, res) => {
  res.send('Hello World from Express + ES Modules!');
});

// Catch-all route
app.all('*', (req, res) => {
  res.status(404).send(`Route ${req.originalUrl} not found.`);
});

// Start server only if run directly (local dev)
if (import.meta.url === `file://${process.argv[1]}`) {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

export default app;
