import express from 'express';

const app = express();
const router = express.Router();

// Basic GET route
router.get('/', (req, res) => {
  res.send('Hello from Express Router in app.js!');
});

// Use the router
app.use('/', router);

export default app;
