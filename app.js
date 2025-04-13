import express from 'express';
import cors from 'cors'; // ✅ import this

import GetKnowledge from './routes/GetKnowledge.js'; 
import GetTopics from './routes/GetTopics.js';
import GetYt from './routes/GetYt.js';
import GetDoc from './routes/GetDoc.js';
import GetAi from './routes/GetAi.js';
import GetProjects from './routes/GetProjects.js'
import Generateque from './routes/Generateque.js'
import Getroad from './routes/Getroad.js'

const app = express();

app.use(cors()); // ✅ allow all origins by default
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // or set specific domains
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });
  

app.use('/', GetKnowledge);
app.use('/', GetTopics);
app.use('/', GetYt);
app.use('/', GetDoc);
app.use('/', GetAi);
app.use('/', GetProjects);
app.use('/', Generateque);
app.use('/', Getroad);

export default app;
