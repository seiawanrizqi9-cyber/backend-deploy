import { successResponse } from "../utils/response.js";
export class CategoryController {
    categoryService;
    constructor(categoryService) {
        this.categoryService = categoryService;
        this.list = this.list.bind(this);
        this.getById = this.getById.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.getStats = this.getStats.bind(this);
    }
    async list(req, res) {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search;
        const sortBy = req.query.sortBy;
        const sortOrder = req.query.sortOrder || "desc";
        const result = await this.categoryService.list({
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
        successResponse(res, "Produk berhasil diambil", result.categories, pagination);
    }
    async create(req, res) {
        const category = await this.categoryService.create(req.body.name);
        successResponse(res, "Kategori berhasil ditambahkan", category, null, 201);
    }
    async getById(req, res) {
        const category = await this.categoryService.getById(req.params.id);
        successResponse(res, "Kategori berhasil diambil", category, null, 200);
    }
    async update(req, res) {
        const category = await this.categoryService.update(req.params.id, req.body.name);
        successResponse(res, "Kategori berhasil diupdate", category, null, 200);
    }
    async delete(req, res) {
        const category = await this.categoryService.delete(req.params.id);
        successResponse(res, "Kategori berhasil dihapus", category, null, 200);
    }
    async getStats(_req, res) {
        const stats = await this.categoryService.exec();
        successResponse(res, "Kategori berhasil diambil", stats, null, 200);
    }
}
//# sourceMappingURL=category.controller.js.map
