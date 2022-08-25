import { Router } from 'express';
import { authCheck } from '../lib/authCheck';
import { checkConnection } from '../lib/checkConnection';
import { getClient } from '../lib/redisClient';

const router = Router();

router.use(authCheck);

router.put('/offer-connection', async (req, res) => {
	const { userToRequest } = req.body;
	const { username } = req.session;
	// with the auth check this is redundant-ish
	// technically possible for the session to end
	// before we need the username
	if (!username) {
		return res.status(401).end();
	}
	if (typeof userToRequest !== 'string') {
		return res.status(400).json({ error: 'Missing userToRequest' }).end();
	}
	const client = getClient();
	const userToRequestExists = await client.sIsMember('users', userToRequest);
	if (!userToRequestExists) {
		return res.status(400).json({ error: 'User to request does not exist' }).end();
	}

	// not sure if this is idempontent
	await client.sAdd(`connection-permission:${userToRequest}`, username);
	checkConnection(client, username, userToRequest);
	return res.status(200).end();
});

router.put('/remove-connection', async (req, res) => {
	const { userToRemove } = req.body;
	const { username } = req.session;
	if (!username) {
		return res.status(401).end();
	}
	if (typeof userToRemove !== 'string') {
		return res.status(400).json({ error: 'Missing userToRemove' }).end();
	}
	const client = getClient();
	const userToRemoveExists = await client.sIsMember('users', userToRemove);
	if (!userToRemoveExists) {
		return res.status(400).json({ error: 'User to remove does not exist' }).end();
	}

	// could this fail? it seems like this is idempontent but maybe not
	await client.sRem(`connection-permission:${userToRemove}`, username);
	await client.sRem(`connection-permission:${username}`, userToRemove);
	await checkConnection(client, username, userToRemove);
	return res.status(200).end();
});

router.get('/connections', async (req, res) => {
	const { username } = req.session;
	if (!username) {
		return res.status(401).end();
	}
	const client = getClient();
	const connections = await client.sMembers(`user-connections:${username}`);
	return res
		.status(200)
		.json([...connections])
		.end();
});

export { router as connection };
