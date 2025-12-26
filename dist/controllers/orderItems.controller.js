import { successResponse } from "../utils/response.js";
export class OrderItemController {
    orderItemService;
    constructor(orderItemService) {
        this.orderItemService = orderItemService;
        this.list = this.list.bind(this);
        this.getById = this.getById.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.getStats = this.getStats.bind(this);
    }
    async list(req, res) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const search = req.query.search;
            const sortBy = req.query.sortBy;
            const sortOrder = req.query.sortOrder || "desc";
            const result = await this.orderItemService.list({
                page,
                limit,
                search,
                sortBy,
                sortOrder,
            });
            const pagination = {
                page: result.currentPage,
                limit,
                total: result.total,
                totalPages: result.totalPages,
            };
            successResponse(res, "Order items berhasil diambil", result.orderItems, pagination);
        }
        catch (error) {
            throw new Error(error.message || "Gagal mengambil order items");
        }
    }
    async getById(req, res) {
        try {
            if (!req.params.id) {
                throw new Error("Parameter ID tidak ditemukan");
            }
            const orderItem = await this.orderItemService.getById(req.params.id);
            successResponse(res, "Order item berhasil diambil", orderItem);
        }
        catch (error) {
            throw new Error(error.message || "Order item tidak ditemukan");
        }
    }
    async create(req, res) {
        try {
            const { order_id, product_id, quantity } = req.body;
            if (!order_id || !product_id || !quantity) {
                throw new Error("Semua field wajib diisi: order_id, product_id, quantity");
            }
            const data = {
                order_id: Number(order_id),
                product_id: Number(product_id),
                quantity: Number(quantity),
            };
            const orderItem = await this.orderItemService.create(data);
            successResponse(res, "Order item berhasil dibuat", orderItem, null, 201);
        }
        catch (error) {
            throw new Error(error.message || "Gagal membuat order item");
        }
    }
    async update(req, res) {
        try {
            if (!req.params.id) {
                throw new Error("Parameter ID tidak ditemukan");
            }
            const orderItem = await this.orderItemService.update(req.params.id, req.body);
            successResponse(res, "Order item berhasil diupdate", orderItem);
        }
        catch (error) {
            throw new Error(error.message || "Gagal mengupdate order item");
        }
    }
    async delete(req, res) {
        try {
            if (!req.params.id) {
                throw new Error("Parameter ID tidak ditemukan");
            }
            const deleted = await this.orderItemService.delete(req.params.id);
            successResponse(res, "Order item berhasil dihapus", deleted);
        }
        catch (error) {
            throw new Error(error.message || "Gagal menghapus order item");
        }
    }
    async getStats(_req, res) {
        try {
            const stats = await this.orderItemService.exec();
            successResponse(res, "Statistik berhasil diambil", stats);
        }
        catch (error) {
            throw new Error(error.message || "Terjadi kesalahan");
        }
    }
}
//# sourceMappingURL=orderItems.controller.js.map
