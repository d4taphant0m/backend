import express from 'express';
import GetKnowledge from './routes/GetKnowledge.js'; 

const app = express();

app.use(express.json());

app.use('/', GetKnowledge);

// const port = process.env.PORT || 3000;

// app.listen(port, () => {
//   console.log(`🚀 Server running locally at http://localhost:${port}`);
// });

export default app;
