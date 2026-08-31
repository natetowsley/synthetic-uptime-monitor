import 'dotenv/config';
import app from './app.js';
import logger from './config/logger.js'

const PORT: number = parseInt(process.env.PORT ?? '4000')



app.listen(PORT, () => {
    logger.info({ port: PORT }, "app listening")
});