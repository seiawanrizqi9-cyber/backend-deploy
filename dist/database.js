import { PrismaClient } from "./generated/client.js";
import { Pool } from "pg";
import config from "./utils/env.js";
import { PrismaPg } from "@prisma/adapter-pg";
let prisma;
const getPrisma = () => {
    if (!prisma) {
        const pool = new Pool({ connectionString: config.DATABASE_URL });
        const adapter = new PrismaPg(pool);
        prisma = new PrismaClient({ adapter });
    }
    return prisma;
};
export const prismaInstance = getPrisma();
export default prismaInstance;
//# sourceMappingURL=database.js.map
