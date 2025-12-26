export class OrderItemRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(skip, take, where, orderBy) {
        return await this.prisma.orderItem.findMany({
            skip,
            take,
            where,
            orderBy,
            include: {
                order: {
                    select: {
                        id: true,
                        total: true,
                        user: {
                            select: {
                                username: true,
                                email: true,
                            },
                        },
                    },
                },
                product: {
                    select: {
                        name: true,
                        price: true,
                        image: true,
                    },
                },
            },
        });
    }
    async countAll(where) {
        return await this.prisma.orderItem.count({ where });
    }
    async findById(id) {
        return await this.prisma.orderItem.findUnique({
            where: { id, deletedAt: null },
            include: { product: true, order: true },
        });
    }
    async create(data) {
        return await this.prisma.orderItem.create({ data });
    }
    async update(id, data) {
        return await this.prisma.orderItem.update({
            where: { id, deletedAt: null },
            data,
        });
    }
    async softDelete(id) {
        return await this.prisma.orderItem.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
    async findComplex(id, user_id) {
        return await this.prisma.orderItem.findMany({
            where: { id, order: { user_id } },
        });
    }
    async getStats() {
        return await this.prisma.orderItem.aggregate({
            _count: {
                id: true,
            },
            _avg: {
                quantity: true,
            },
            _sum: {
                quantity: true,
            },
            _min: {
                quantity: true,
            },
            _max: {
                quantity: true,
            },
        });
    }
    async getOrderItemsByOrder() {
        return await this.prisma.orderItem.groupBy({
            by: ["id"],
            _count: {
                id: true,
            },
        });
    }
}
//# sourceMappingURL=orderItems.repository.js.map