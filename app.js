import express from 'express';

const app = express();
const router = express.Router();

router.get('/', (req, res) => {
  res.send('✅ This route is fast and working!');
});

app.use('/', router);
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`🚀 Server running locally at http://localhost:${port}`);
  });

export default app;
