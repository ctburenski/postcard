import { Router } from 'express';
import { getClient } from '../lib/redisClient';
import * as argon2 from 'argon2';

const router = Router();

router.post('/register', async (req, res) => {
	// TODO need to add CSRF token to the data
	const { username, password: unhashedPassword } = req.body;

	if (typeof username !== 'string' || typeof unhashedPassword !== 'string') {
		return res.status(400).json({ error: 'missing username or password' });
	}

	const client = getClient();
	// TODO this is a security concern for username enumeration
	// and a factor in username ransoming
	// could maybe do something like discord and use a suffix
	// and then an option to remove it once the user is fully registered
	const usernameAdded = await client.sAdd('users', username);
	if (!usernameAdded) {
		return res.status(400).json({ error: 'username taken' });
	}

	// argon2 adds a salt and hashes the password
	const hashedPassword = await argon2.hash(unhashedPassword);
	const passwordAdded = await client.hSet(`user:${username}`, 'password', hashedPassword);
	if (!passwordAdded) {
		// TODO need to remove the user from the set?
		// or maybe let them reset their password
		// once we have a way to reset their password lol
		return res.status(500).end();
	}

	req.session.username = username;
	// TODO should maybe return 201 with a location header
	// to the user's profile page - which doesnt exist yet lol
	return res.status(200).end();
});

router.put('/login', async (req, res) => {
	const { username, password } = req.body;

	if (typeof username !== 'string' || typeof password !== 'string') {
		return res.status(400).json({ error: 'username and password are required' });
	}

	const client = getClient();
	const usernameExists = await client.sIsMember('users', username);
	if (!usernameExists) {
		// TODO should be doing the verify anyway
		// to prevent username enumeration
		// just not sure what the best way to do this is
		return res.status(500).end();
	}
	const storedPassword = await client.hGet(`user:${username}`, 'password');
	// this will short circuit if the client returns null
	// but I'm not sure if that's an issue
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
	if (typeof username !== 'string') {
		return res.json(null);
	} else {
		return res.json({ username });
	}
});

export { router as auth };
