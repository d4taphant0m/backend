import express from 'express';
import GetKnowledge from './routes/GetKnowledge.js'; 
import GetTopics from './routes/GetTopics.js'
import GetYt from './routes/GetYt.js'
import GetDoc from './routes/GetDoc.js'
import GetAi from './routes/GetAi.js'

const app = express();

app.use(express.json());

app.use('/', GetKnowledge);
app.use('/', GetTopics);
app.use('/', GetYt);
app.use('/', GetDoc);
app.use('/', GetAi);

// const port = process.env.PORT || 3000;

// app.listen(port, () => {
//   console.log(`🚀 Server running locally at http://localhost:${port}`);
// });

export default app;
