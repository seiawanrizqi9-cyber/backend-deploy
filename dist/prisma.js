import { PrismaClient } from "./generated/client.js";
import { Pool } from "pg";
import { PrismaPg } from "../node_modules/@prisma/adapter-pg/dist/index";
import config from "./utils/env.js";
let prisma;
export const getPrisma = () => {
    if (!prisma) {
        const pool = new Pool({ connectionString: config.DATABASE_URL });
        const adapter = new PrismaPg(pool);
        prisma = new PrismaClient({ adapter });
    }
    return prisma;
};
//# sourceMappingURL=prisma.js.map
