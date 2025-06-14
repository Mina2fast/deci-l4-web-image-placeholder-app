import express from 'express';
import cors from 'cors';
import path from 'path';
import apiRoutes from './routes/api.routes';
const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../frontend/public')));
app.get('/', (_req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/public/index.html'));
});
app.use('/api', apiRoutes);
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
export default app;
