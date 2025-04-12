import express from "express";

const app = express();

// Middleware for parsing request body
app.use(express.json());

app.get('/', function (_, res) {

    res.send({
        message: "working"
    });
});

export default app;