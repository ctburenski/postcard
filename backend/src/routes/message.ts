import { Router } from 'express';
import { getClient } from '../lib/redisClient';

const router = Router();

router.post('/send-message', async (req, res) => {
	const { username } = req.session;
	if (!username) {
		return res.status(401).end();
	}
	const { userToSendTo, message } = req.body;

	const client = getClient();
	const userToSendToExists = await client.sIsMember('users', userToSendTo);
	if (!userToSendToExists) {
		return res.status(400).end();
	}

	const messageSent = await client.lPush(
		`user-messages:${userToSendTo}`,
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
	if (!username) {
		return res.status(401).end();
	}

	const client = getClient();
	const userMessages = await client.lRange(`user-messages:${username}`, 0, -1);
	if (!userMessages) {
		return res.status(500).end();
	}
	return res.status(200).json(userMessages);
});

export { router as message };
