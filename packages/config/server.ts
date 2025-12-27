import dotenv from 'dotenv';

dotenv.config({
    path: `./.env.${process.env.NODE_ENV}`,
});

export const SERVER = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: Number(process.env.PORT) ?? 3000,
    HOST_URL: process.env.HOST_URL ?? 'http://localhost:5001',
};

export const AWS_CONFIG = {
    ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    REGION: process.env.AWS_REGION,
    BUCKET_NAME: process.env.AWS_BUCKET_NAME,
};

export const CORS = {
    ORIGIN: process.env.CORS_ORIGIN,
    CREDENTIALS: process.env.CORS_CREDENTIALS === 'true',
};

export const JWT = {
    ACCESS_SECRET: process.env.JWT_ACCESS_SECRET ?? 'access_secret',
    REFRESH_SECRET: process.env.JWT_REFRESH_SECRET ?? 'refresh',
    ACCESS_EXPIRATION: process.env.JWT_ACCESS_EXPIRATION ?? '5d',
    ACCESS_EXPIRATION_IN_SECONDS: process.env.JWT_ACCESS_EXPIRATION_IN_SECONDS ?? 60 * 60 * 24 * 5,
    REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION ?? '15d',
    REFRESH_EXPIRATION_IN_SECONDS: process.env.JWT_REFRESH_EXPIRATION_IN_SECONDS ?? 60 * 60 * 24 * 15,
};

export const PASSWORD = {
    ROUND: Number(process.env.PASSWORD_ROUND),
    FORGET_PASSWORD_EXPIRATION: Number(process.env.FORGET_PASSWORD_EXPIRATION),
};

export const PDF_SERVICE = {
    URL: process.env.HTML_TO_PDF,
};
export const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:3000';