import { Router } from "express";

const router = Router();

router.get('/', (req, res) => {
    res.json(['test1', 'test1'])
})

export { router as messages };
