import { NextFunction, Request, Response } from 'express';

// TODO this function doesn't pass on
// the type checking for the session
// not sure if we can fix that
async function authCheck(req: Request, res: Response, next: NextFunction) {
	if (typeof req.session.username !== 'string') {
		res.status(401).end();
	} else {
		next();
	}
}

export { authCheck };
