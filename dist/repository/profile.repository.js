export class ProfileRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(skip, take, where, orderBy) {
        return await this.prisma.profile.findMany({
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
                        role: true,
                        createdAt: true,
                    },
                },
            },
        });
    }
    async countAll(where) {
        return await this.prisma.profile.count({ where });
    }
    async findById(id) {
        return await this.prisma.profile.findUnique({
            where: { id, deletedAt: null },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
    }
    async findByUserId(userId) {
        return await this.prisma.profile.findUnique({
            where: { user_id: userId, deletedAt: null },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
    }
    async create(data) {
        return await this.prisma.profile.create({
            data,
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
    }
    async update(id, data) {
        return await this.prisma.profile.update({
            where: { id, deletedAt: null },
            data,
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
    }
    async softDelete(id) {
        return await this.prisma.profile.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
    async findComplex(name, user_id) {
        return await this.prisma.profile.findMany({
            where: {
                OR: [{ name: { contains: name } }, { user: { id: user_id } }],
            },
        });
    }
    async getStats() {
        return await this.prisma.profile.aggregate({
            _count: {
                id: true,
            },
        });
    }
    async getProfileByCategoryStats() {
        return await this.prisma.profile.groupBy({
            by: ["id"],
            _count: {
                id: true,
            },
        });
    }
}
//# sourceMappingURL=profile.repository.js.map