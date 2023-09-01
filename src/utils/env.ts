import dotenv from 'dotenv';
import { Environment } from '../types';
import path from 'path';
import logger from '../logger';

export const loadEnvironment = () => {
    const env = process.env.ENV as Environment;
    
    if (env === undefined) {
        logger.fatal(`Missing environment variable.`);
        process.exit(-1);    
    }
    
    if (!Object.values(Environment).includes(env)) {
        logger.fatal(`Invalid environment variable: '${env}'`);
        process.exit(-1);
    }
    
    // Load environment variables
    dotenv.config({
        path: path.resolve(process.cwd(), `.env.${env}`),
    });

    return env;
}