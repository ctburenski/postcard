import { NextFunction, Request, Response } from 'express';

async function authCheck(req: Request, res: Response, next: NextFunction) {
	if (typeof req.session.username !== 'string') {
		res.status(401).end();
	} else {
		next();
	}
}

export { authCheck };
