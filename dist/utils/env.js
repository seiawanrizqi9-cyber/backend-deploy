import dotenv from 'dotenv';
dotenv.config();
export default {
    HOST: process.env.HOST || 'localhost',
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
};
//# sourceMappingURL=env.js.map