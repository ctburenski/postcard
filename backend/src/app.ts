import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { getClient, init } from './lib/redisClient';
import { messages } from './routes/message';

const app = express();

app.use(cors());
app.use(helmet());

app.use('/api/', messages);

app.get('/api', async (req, res) => {
    const client = getClient();
    const result = await client.set('test', 'ok');
    if (result) {
        return res.send(result);
    } else {
        return res.status(500).end();
    }
});

(async () => {
    await init()
    app.listen(6060)
})();
