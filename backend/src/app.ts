import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { getClient, init } from './lib/redisClient';

const app = express();

app.use(cors());
app.use(helmet());

app.get('/api', async (req, res) => {
    const client = getClient();
    const num = await client.incr('num');
    return res.send(`hello from api!\nNum is: ${num}`)
});

(async () => {
    await init()
    app.listen(6060)
})();
