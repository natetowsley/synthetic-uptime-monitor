import express, { type NextFunction, type Express, type Request, type Response } from 'express';
import logger from './config/logger.js';
import { pinoHttp } from 'pino-http';

const app: Express = express();
app.use(express.json());
app.use(pinoHttp({ logger }));

app.get('/', middle, (req: Request, res: Response) => {
    res.send('Hello!');
});

function middle(req: Request, res: Response, next: NextFunction) {
    req.log.info('other text');
    next();
}

export default app;
