import express from 'express';
import cors from 'cors'; // ✅ import this

import GetKnowledge from './routes/GetKnowledge.js'; 
import GetTopics from './routes/GetTopics.js';
import GetYt from './routes/GetYt.js';
import GetDoc from './routes/GetDoc.js';
import GetAi from './routes/GetAi.js';

const app = express();

app.use(cors()); // ✅ allow all origins by default
app.use(express.json());

app.use('/', GetKnowledge);
app.use('/', GetTopics);
app.use('/', GetYt);
app.use('/', GetDoc);
app.use('/', GetAi);

export default app;
