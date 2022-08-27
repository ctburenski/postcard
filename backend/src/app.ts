import express from 'express';
import session from 'express-session';
import cors from 'cors';
import helmet from 'helmet';
import { getClient } from './lib/redisClient';
import { message } from './routes/message';
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

// TODO this works ok for fetch but not
// for clients not using javascript
app.use(express.json());

// don't need cors while using a proxy
// might change this later if we use a CDN
// app.use(cors());

// TODO need to ensure this is secure
// and lines up with the securiy expectations
// for the proxy server
app.use(helmet());

app.use('/api/auth', auth);

app.use('/api/connection', authCheck, connection);

app.use('/api/message', authCheck, message);

export default app;
