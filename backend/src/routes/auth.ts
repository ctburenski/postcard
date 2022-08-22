import { Router } from "express";
import { getClient } from "../lib/redisClient";

const router = Router();

router.put('/login', (req, res) => {

})

router.post('/register', async (req, res) => {
    const client = getClient();
    const data = req.body;
    // TODO need to add CSRF token to the data
    const {
        username,
        password,
    } = data;

    if (!username || !password) {
        return res.status(400).json({ 'error': 'Missing username or password' });
    }

    const usernameAdded = await client.sAdd('users', username);
    if (!usernameAdded) {
        return res.status(500).end();
    }
    const passwordAdded = await client.hSet(`user:${username}`, 'password', password);
    if (!passwordAdded) {
        // TODO need to remove the user from the set?
        // or maybe let them reset their password
        // once we have a way to reset their password lol
        return res.status(500).end();
    }

    req.session.username = username;
    return res.status(200).end();
})

router.get('/logged-in', async (req, res) => {
    const client = getClient();
    const username = req.session.username;
    if (!username) {
        return res.json({ 'username': null });
    }
    const loggedIn = await client.hGet(`user:${username}`, 'loggedIn');
    if (loggedIn) {
        return res.json({ 'username': username });
    } else {
        return res.json({ 'username': null });
    }
})

export { router as auth };
