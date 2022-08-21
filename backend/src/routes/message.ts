import { Router } from "express";

const router = Router();

router.get('/messages', (req, res) => {
    res.json(['test1', 'test1'])
})

export { router as messages };
