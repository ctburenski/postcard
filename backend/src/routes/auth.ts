import { Router } from 'express';
import { getClient } from '../lib/redisClient';
import * as argon2 from 'argon2';

const router = Router();

router.post('/register', async (req, res) => {
	// TODO need to add CSRF token to the data
	const { username, password } = req.body;

	if (!username || !password) {
		return res.status(400).json({ error: 'missing username or password' });
	}

	const client = getClient();
	const usernameAdded = await client.sAdd('users', username);
	if (!usernameAdded) {
		return res.status(500).end();
	}

	// argon2 adds a salt and hashes the password
	const hashedPassword = await argon2.hash(password);
	const passwordAdded = await client.hSet(`user:${username}`, 'password', hashedPassword);
	if (!passwordAdded) {
		// TODO need to remove the user from the set?
		// or maybe let them reset their password
		// once we have a way to reset their password lol
		return res.status(500).end();
	}

	req.session.username = username;
	return res.status(200).end();
});

router.put('/login', async (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) {
		return res.status(400).json({ error: 'username and password are required' });
	}

	const client = getClient();
	const usernameValid = await client.sIsMember('users', username);
	if (!usernameValid) {
		return res.status(500).end();
	}
	const storedPassword = await client.hGet(`user:${username}`, 'password');
	// Need to use hashing here
	if (storedPassword && (await argon2.verify(storedPassword, password))) {
		req.session.username = username;
		return res.status(200).end();
	} else {
		return res.status(500).end();
	}
});

router.put('/logout', async (req, res) => {
	req.session.username = undefined;
	return res.status(200).end();
});

router.get('/logged-in', async (req, res) => {
	const username = req.session.username;
	if (!username) {
		return res.json(null);
	} else {
		return res.json({ username: username });
	}
});

export { router as auth };
