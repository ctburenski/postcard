import express from 'express';
import session from 'express-session';
import cors from 'cors';
import helmet from 'helmet';
import { getClient, init } from './lib/redisClient';
import { messages } from './routes/message';
import { auth } from './routes/auth';
import { connection } from './routes/connection';
import { authCheck } from './lib/authCheck';

const app = express();

app.set('trust proxy', 1);

// TODO need to use redis for sessions
// and a proper secret for production
app.use(
	session({
		secret: 'keyboard cat',
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: false,
			maxAge: 1000 * 60 * 60 * 24 // 1 day
		}
	})
);

// declaring the properties of the session
declare module 'express-session' {
	export interface Session {
		username: string | undefined;
	}
}

app.use(express.json());
app.use(cors());
app.use(helmet());

app.use('/api/auth', auth);

app.use('/api/connection', authCheck, connection);

app.get('/api/test', async (_req, res) => {
	const client = getClient();
	const result = await client.set('test', 'ok');
	if (result) {
		return res.send(result);
	} else {
		return res.status(500).end();
	}
});

app.use('/api/messages', messages);

(async () => {
	await init();
	app.listen(6060);
})();
