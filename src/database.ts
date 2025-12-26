import {PrismaClient} from "./generated/client";
import {Pool} from "pg";
import config from './utils/env'
import { PrismaPg } from "@prisma/adapter-pg";

let prisma: PrismaClient;

const getPrisma = () => {
    if (!prisma) {
        const pool = new Pool({connectionString: config.DATABASE_URL})
        const adapter = new PrismaPg(pool)
        prisma = new PrismaClient({adapter})
    }
    return prisma;
};

export const prismaInstance = getPrisma()


export default prismaInstance