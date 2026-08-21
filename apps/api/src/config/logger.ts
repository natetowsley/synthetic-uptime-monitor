import pino from 'pino';

const isDev = process.env.NODE_ENV === 'development';

const logger = pino({
    transport: 
        isDev ? { target: 'pino-pretty' }: undefined,
    level: 
        isDev ? 'debug' : 'info',
});

export default logger;
