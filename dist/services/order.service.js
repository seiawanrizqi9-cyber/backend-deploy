export class OrderService {
    orderRepo;
    prisma;
    constructor(orderRepo, prisma) {
        this.orderRepo = orderRepo;
        this.prisma = prisma;
    }
    async list(params) {
        const { page, limit, search, sortBy, sortOrder, userId } = params;
        const skip = (page - 1) * limit;
        const whereClause = {
            deletedAt: null,
        };
        if (userId) {
            whereClause.user_id = userId;
        }
        if (search?.min_total || search?.max_total) {
            whereClause.total = {};
            if (search?.min_total) {
                whereClause.total.gte = search.min_total;
            }
            if (search?.max_total) {
                whereClause.total.lte = search.max_total;
            }
        }
        const sortCriteria = sortBy
            ? {
                [sortBy]: sortOrder || "desc",
            }
            : { createdAt: "desc" };
        const orders = await this.orderRepo.list(skip, limit, whereClause, sortCriteria);
        const total = await this.orderRepo.countAll(whereClause);
        return {
            orders,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        };
    }
    async findById(id) {
        const numId = parseInt(id);
        const order = await this.orderRepo.findById(numId);
        if (!order)
            throw new Error("Order tidak ditemukan");
        // Type assertion untuk mengakses properti yang di-include
        const orderWithIncludes = order;
        return {
            id: order.id,
            customer: orderWithIncludes.user?.username || "Unknown",
            email: orderWithIncludes.user?.email || "",
            total: Number(order.total),
            tanggal: order.createdAt,
            items: (orderWithIncludes.orderItems || []).map((item) => ({
                produk: item.product?.name || "Unknown",
                harga_satuan: Number(item.product?.price || 0),
                jumlah: item.quantity,
            })),
        };
    }
    async create(data) {
        return await this.orderRepo.create({
            user_id: data.user_id,
            total: data.total || 0,
        });
    }
    async update(id, data) {
        // Periksa apakah order ada
        await this.findById(id);
        const numId = parseInt(id);
        return await this.orderRepo.update(numId, data);
    }
    async delete(id) {
        const numId = parseInt(id);
        return await this.orderRepo.softDelete(numId);
    }
    async checkout(data) {
        if (!data.user_id) {
            throw new Error("User ID diperlukan");
        }
        let total = 0;
        // Validasi stok dan hitung total
        for (const item of data.orderItems) {
            const product = await this.prisma.product.findUnique({
                where: { id: item.product_id },
            });
            if (!product)
                throw new Error(`Produk ID ${item.product_id} tidak ditemukan`);
            if (product.stock < item.quantity) {
                throw new Error(`Stok "${product.name}" tidak cukup. Tersedia: ${product.stock}`);
            }
            total += Number(product.price) * item.quantity;
        }
        // Gunakan transaction
        const result = await this.prisma.$transaction(async (tx) => {
            // Buat order - HANYA ambil user_id, tidak include user
            const order = await tx.order.create({
                data: {
                    user_id: data.user_id,
                    total,
                },
            });
            // Ambil data user terpisah untuk response
            const user = await tx.user.findUnique({
                where: { id: data.user_id },
                select: { id: true, username: true, email: true },
            });
            if (!user) {
                throw new Error("User tidak ditemukan");
            }
            // Buat order items dan update stok
            const orderItems = [];
            for (const item of data.orderItems) {
                const orderItem = await tx.orderItem.create({
                    data: {
                        order_id: order.id,
                        product_id: item.product_id,
                        quantity: item.quantity,
                    },
                    include: {
                        product: {
                            select: { id: true, name: true, price: true },
                        },
                    },
                });
                await tx.product.update({
                    where: { id: item.product_id },
                    data: { stock: { decrement: item.quantity } },
                });
                orderItems.push(orderItem);
            }
            return {
                order_id: order.id,
                user, // user adalah object tunggal, bukan array
                total: Number(order.total),
                items: orderItems.map((item) => ({
                    product_id: item.product_id,
                    product_name: item.product.name,
                    price: Number(item.product.price),
                    quantity: item.quantity,
                    subtotal: Number(item.product.price) * item.quantity,
                })),
                total_items: orderItems.length,
                created_at: order.createdAt,
            };
        });
        return result;
    }
    async exec() {
        const state = await this.orderRepo.getStats();
        const category = await this.orderRepo.getOrderById();
        return { overview: state, byCategory: category };
    }
}
//# sourceMappingURL=order.service.js.map