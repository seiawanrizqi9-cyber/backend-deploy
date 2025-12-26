export class CategoryRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(skip, take, where, orderBy) {
        return await this.prisma.category.findMany({
            skip,
            take,
            where,
            orderBy,
        });
    }
    async countAll(where) {
        return await this.prisma.category.count({ where });
    }
    async findById(id) {
        return await this.prisma.category.findUnique({
            where: { id },
        });
    }
    async findByName(name) {
        return await this.prisma.category.findUnique({
            where: { name },
        });
    }
    async create(data) {
        return await this.prisma.category.create({ data });
    }
    async update(id, data) {
        return await this.prisma.category.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        return await this.prisma.category.delete({
            where: { id },
        });
    }
    async findComplex(categoryName, maxPrice) {
        return await this.prisma.product.findMany({
            where: {
                OR: [
                    {
                        category: {
                            name: categoryName,
                        },
                    },
                    { category: { name: "Aksesoris" } },
                ],
                price: {
                    lte: maxPrice,
                },
            },
        });
    }
    async getStats() {
        return await this.prisma.category.aggregate({
            _count: {
                id: true,
            },
        });
    }
}
//# sourceMappingURL=category.repository.js.map