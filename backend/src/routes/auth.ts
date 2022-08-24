import { Router } from "express";
import { getClient } from "../lib/redisClient";

const router = Router();

router.post('/register', async (req, res) => {
    const data = req.body;
    // TODO need to add CSRF token to the data
    const {
        username,
        password,
    } = req.body;

    if (!username || !password) {
        return res.status(400).json({ 'error': 'missing username or password' });
    }

    const client = getClient();
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

router.put('/login', async (req, res) => {
    const {
        username,
        password
    } = req.body;

    if (!username || !password) {
        return res.status(400).json({ 'error': 'username and password are required' });
    }

    const client = getClient();
    const usernameValid = await client.sIsMember('users', username);
    if (!usernameValid) {
        return res.status(500).end();
    }
    const storedPassword = await client.hGet(`user:${username}`, 'password');
    // Need to use hashing here
    if (storedPassword !== password) {
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
