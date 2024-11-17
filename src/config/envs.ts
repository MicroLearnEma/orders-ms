import 'dotenv/config'

import Joi, * as joi from 'joi'

interface EnvVars {
    APP_PORT: number
    DATABASE_URL: string
    ENVIRONMENT: 'development' | 'testing' | 'production' | 'debug'
}


const envSchema = joi.object<EnvVars>({
    APP_PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
    ENVIRONMENT: joi.string().default('development')
}).unknown(true);

const { error, value } = envSchema.validate(process.env);

const envVars: EnvVars = value;

if(error) throw new Error(`Config validation error ${error.message}`);

export const env = {
    port: envVars.APP_PORT,
    databaseUrl: envVars.DATABASE_URL,
    environment: envVars.ENVIRONMENT
}


