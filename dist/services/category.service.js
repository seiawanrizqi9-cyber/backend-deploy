export class CategoryService {
    categoryRepo;
    constructor(categoryRepo) {
        this.categoryRepo = categoryRepo;
    }
    async list(params) {
        const { page, limit, search, sortBy, sortOrder } = params;
        const skip = (page - 1) * limit;
        const whereClause = {};
        if (search?.name) {
            whereClause.name = {
                contains: search.name,
                mode: "insensitive",
            };
        }
        const sortCriteria = sortBy
            ? {
                [sortBy]: sortOrder || "desc",
            }
            : { createdAt: "desc" };
        const categories = await this.categoryRepo.list(skip, limit, whereClause, sortCriteria);
        const total = await this.categoryRepo.countAll(whereClause);
        return {
            categories,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        };
    }
    ;
    async getById(id) {
        const numId = parseInt(id);
        return await this.categoryRepo.findById(numId);
    }
    ;
    async create(name) {
        const isExist = await this.categoryRepo.findByName(name);
        if (isExist)
            throw new Error("Nama kategori sudah ada");
        return await this.categoryRepo.create({ name });
    }
    ;
    async update(id, name) {
        const numId = parseInt(id);
        return await this.categoryRepo.update(numId, { name });
    }
    ;
    async delete(id) {
        const numId = parseInt(id);
        return await this.categoryRepo.delete(numId);
    }
    ;
    async exec() {
        const state = await this.categoryRepo.getStats();
        return { overview: state };
    }
}
//# sourceMappingURL=category.service.js.map