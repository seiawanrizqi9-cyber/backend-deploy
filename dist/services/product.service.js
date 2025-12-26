export class ProductService {
    productRepo;
    constructor(productRepo) {
        this.productRepo = productRepo;
    }
    async list(params) {
        const { page, limit, search, sortBy, sortOrder } = params;
        const skip = (page - 1) * limit;
        const whereClause = {
            deletedAt: null,
        };
        if (search?.name)
            whereClause.name = {
                contains: search.name,
                mode: "insensitive",
            };
        if (search?.min_price)
            whereClause.price = {
                gte: search.min_price,
            };
        if (search?.max_price)
            whereClause.price = {
                lte: search.max_price,
            };
        const sortCriteria = sortBy
            ? {
                [sortBy]: sortOrder || "desc",
            }
            : { createdAt: "desc" };
        const products = await this.productRepo.list(skip, limit, whereClause, sortCriteria);
        const total = await this.productRepo.countAll(whereClause);
        return {
            products,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        };
    }
    async getById(id) {
        const numId = Number(id);
        if (isNaN(numId)) {
            throw new Error("ID harus berupa angka");
        }
        const product = await this.productRepo.findById(numId);
        if (!product) {
            throw new Error("Product tidak ditemukan");
        }
        return product;
    }
    async create(data) {
        return await this.productRepo.create(data);
    }
    async update(id, data) {
        await this.getById(id);
        const numId = Number(id);
        if (isNaN(numId)) {
            throw new Error("ID harus berupa angka");
        }
        return await this.productRepo.update(numId, data);
    }
    async delete(id) {
        const numId = Number(id);
        if (isNaN(numId)) {
            throw new Error("ID harus berupa angka");
        }
        return await this.productRepo.softDelete(numId);
    }
    async exec() {
        const state = await this.productRepo.getStats();
        const category = await this.productRepo.getProductsByCategoryStats();
        return { overview: state, byCategory: category };
    }
}
//# sourceMappingURL=product.service.js.map