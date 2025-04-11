import * as dotenv from 'dotenv';

dotenv.config();

export const MAIN_PORT = process.env.MAIN_PORT || 3000;
// Setup the environment variables
export const PROJECT_NAME = process.env.PROJECT_NAME;
