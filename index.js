import express from 'express';
import serverless from 'serverless-http';
import router from './routes/getroute.js';

const app = express();

// Mount the router
app.use('/', router);

// Export for Vercel
export default serverless(app);
