export class OrderItemService {
    orderItemRepo;
    constructor(orderItemRepo) {
        this.orderItemRepo = orderItemRepo;
    }
    async list(params) {
        const { page, limit, search, sortBy, sortOrder } = params;
        const skip = (page - 1) * limit;
        const whereClause = { deletedAt: null };
        if (search?.order_id) {
            whereClause.order_id = search.order_id;
        }
        if (search?.product_id) {
            whereClause.product_id = search.product_id;
        }
        if (search?.min_quantity || search?.max_quantity) {
            whereClause.quantity = {};
            if (search?.min_quantity) {
                whereClause.quantity.gte = search.min_quantity;
            }
            if (search?.max_quantity) {
                whereClause.quantity.lte = search.max_quantity;
            }
        }
        const sortCriteria = sortBy
            ? {
                [sortBy]: sortOrder || "desc",
            }
            : { createdAt: "desc" };
        const orderItems = await this.orderItemRepo.list(skip, limit, whereClause, sortCriteria);
        const total = await this.orderItemRepo.countAll(whereClause);
        return {
            orderItems,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        };
    }
    async getById(id) {
        const numId = parseInt(id);
        const orderItem = await this.orderItemRepo.findById(numId);
        if (!orderItem) {
            throw new Error("Order item tidak ditemukan");
        }
        return orderItem;
    }
    async create(data) {
        const createData = {
            order: { connect: { id: data.order_id } },
            product: { connect: { id: data.product_id } },
            quantity: data.quantity,
        };
        return await this.orderItemRepo.create(createData);
    }
    async update(id, data) {
        // Periksa apakah order item ada
        await this.getById(id);
        const numId = parseInt(id);
        return await this.orderItemRepo.update(numId, data);
    }
    async delete(id) {
        const numId = parseInt(id);
        return await this.orderItemRepo.softDelete(numId);
    }
    async exec() {
        const state = await this.orderItemRepo.getStats();
        const category = await this.orderItemRepo.getOrderItemsByOrder();
        return { overview: state, byCategory: category };
    }
}
//# sourceMappingURL=orderItems.service.js.map