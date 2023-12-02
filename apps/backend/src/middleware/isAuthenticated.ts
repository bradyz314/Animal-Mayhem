import { RequestHandler } from 'express';

const isAuthenticated: RequestHandler = (req, res, next) => {
    if (!(req.session && req.session.username)) {
        return res.status(400).send('User is not logged in');
    }
    next();
}

export default isAuthenticated;