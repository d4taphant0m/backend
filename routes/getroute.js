import { Router } from 'express';

const router = Router();

// Basic GET route
router.get('/', (req, res) => {
  res.send('Hello from Express Router!');
});

// Optional: more routes
router.get('/about', (req, res) => {
  res.send('This is the about page.');
});

export default router;
