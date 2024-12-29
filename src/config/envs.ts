import 'dotenv/config'

import Joi, * as joi from 'joi'

interface EnvVars {
    APP_PORT: number
    DATABASE_URL: string
    ENVIRONMENT: 'development' | 'testing' | 'production' | 'debug',
    NATS_SERVERS: string[]
}


const envSchema = joi.object<EnvVars>({
    APP_PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
    ENVIRONMENT: joi.string().default('development'),
    NATS_SERVERS: joi.array().items(joi.string()).required()
}).unknown(true);

const { error, value } = envSchema.validate({
    ...process.env,
    NATS_SERVERS: process.env.NATS_SERVERS.split(",")
});

const envVars: EnvVars = value;

if(error) throw new Error(`Config validation error ${error.message}`);

export const env = {
    port: envVars.APP_PORT,
    databaseUrl: envVars.DATABASE_URL,
    environment: envVars.ENVIRONMENT,
    nats_servers: envVars.NATS_SERVERS
}


