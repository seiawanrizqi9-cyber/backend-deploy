import { getPrisma } from "../prisma";
const prisma = getPrisma();
export const getAllCategories = async () => {
    return await prisma.category.findMany();
};
export const getCategoryById = async (id) => {
    const numId = parseInt(id);
    return await prisma.category.findUnique({
        where: { id: numId, deletedAt: null },
    });
};
export const createCategory = async (name) => {
    const isExist = await prisma.category.findUnique({ where: { name } });
    if (isExist)
        throw new Error("Nama kategori sudah ada");
    return await prisma.category.create({
        data: {
            name,
        },
    });
};
export const categoryUpdate = async (id, name) => {
    const numId = parseInt(id);
    return await prisma.category.update({
        where: { id: numId, deletedAt: null },
        data: { name },
    });
};
export const removeCategory = async (id) => {
    const numId = parseInt(id);
    return await prisma.category.delete({ where: { id: numId, deletedAt: null } });
};
//# sourceMappingURL=category.service.js.map