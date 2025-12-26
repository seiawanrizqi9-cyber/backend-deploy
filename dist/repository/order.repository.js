export class OrderRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(skip, take, where, orderBy) {
        return await this.prisma.order.findMany({
            skip,
            take,
            where,
            orderBy,
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                    },
                },
                orderItems: {
                    include: {
                        product: {
                            select: {
                                name: true,
                                price: true,
                            },
                        },
                    },
                },
            },
        });
    }
    async countAll(where) {
        return await this.prisma.order.count({ where });
    }
    async findById(id) {
        return await this.prisma.order.findUnique({
            where: { id, deletedAt: null },
            include: {
                user: { select: { username: true, email: true } },
                orderItems: {
                    include: {
                        product: { select: { name: true, price: true } },
                    },
                },
            },
        });
    }
    async create(data) {
        return await this.prisma.order.create({ data });
    }
    async update(id, data) {
        return await this.prisma.order.update({
            where: { id, deletedAt: null },
            data,
        });
    }
    async softDelete(id) {
        return await this.prisma.order.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
    async findComplex(id, user_id) {
        return await this.prisma.order.findMany({
            where: {
                OR: [{ id }, { user_id }],
            },
        });
    }
    async getStats() {
        return await this.prisma.order.aggregate({
            _count: {
                id: true,
            },
            _avg: {
                total: true,
            },
            _sum: {
                total: true,
            },
            _min: {
                total: true,
            },
            _max: {
                total: true,
            },
        });
    }
    async getOrderById() {
        return await this.prisma.order.groupBy({
            by: ["id"],
            _count: {
                id: true,
            },
        });
    }
}
//# sourceMappingURL=order.repository.js.map