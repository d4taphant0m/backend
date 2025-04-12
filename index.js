    import app from "./app.js";

const startServer = async () => {
    try {
        const PORT = 3000;
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    } catch (error) {
        console.error('🔥 Error:', error);
        res.send('error aa raha hai bhai')
    }
};

startServer();