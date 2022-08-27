import { Router } from 'express';
import { getClient } from '../lib/redisClient';

const router = Router();

router.post('/send-message', async (req, res) => {
	const { username } = req.session;
	if (typeof username !== 'string') {
		return res.status(401).end();
	}
	const { userToSendTo, message } = req.body;

	if (typeof userToSendTo !== 'string' || typeof message !== 'string') {
		return res.status(400).json({ error: 'Missing userToSendTo or message' });
	}

	const client = getClient();

	// this info leaks that the user exists
	const userToSendToExists = await client.sIsMember('users', userToSendTo);
	if (!userToSendToExists) {
		return res.status(400).json({ error: 'Unable to find that user' });
	}

	const connectionPermissionGiven = await client.sIsMember(
		`connection-permission:${userToSendTo}`,
		username
	);

	if (!connectionPermissionGiven) {
		return res.status(400).json({ error: 'You do not have permission to send to this user' });
	}

	const messageSent = await client.lPush(
		`user-messages:${userToSendTo}`,
		// JSON.stringify can return undefined, despite typescript saying it can't
		// may get resolved as described in this issue: https://github.com/microsoft/TypeScript/issues/18879
		JSON.stringify({ username, message })
	);

	if (!messageSent) {
		return res.status(500).end();
	}
	return res.status(200).end();
});

// TODO add pagination
router.get('/get-messages', async (req, res) => {
	const { username } = req.session;
	if (typeof username !== 'string') {
		return res.status(401).end();
	}

	const client = getClient();
	const userMessages = await client.lRange(`user-messages:${username}`, 0, -1);
	if (userMessages.length == 0) {
		return res.status(500).end();
	}
	return res.status(200).json(userMessages.map((messageObject) => JSON.parse(messageObject)));
});

export { router as message };
