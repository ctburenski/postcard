import { NextFunction, Request, Response } from 'express';

async function authCheck(req: Request, res: Response, next: NextFunction) {
	if (!req.session.username) {
		res.status(401).end();
	} else {
		next();
	}
}

export { authCheck };
