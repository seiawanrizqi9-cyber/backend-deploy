import type { Category, Prisma } from "../generated";
import type { ICategoryRepository } from "../repository/category.repository";

interface FindAllParams {
  page: number;
  limit: number;
  search?: {
    name?: string;
  };
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface CategoryListResponse {
  categories: Category[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface ICategoryService {
  list(params: FindAllParams): Promise<CategoryListResponse>;
  getById(id: string): Promise<Category | null>;
  create(name: string): Promise<Category>;
  update(id: string, name: string): Promise<Category>;
  delete(id: string): Promise<Category>;
  exec(): Promise<{ overview: any }>
}

export class CategoryService implements ICategoryService {
  constructor(private categoryRepo: ICategoryRepository) {}

async list (params: FindAllParams): Promise<CategoryListResponse> {
  const { page, limit, search, sortBy, sortOrder } = params;
  const skip = (page - 1) * limit;

  const whereClause: Prisma.CategoryWhereInput = {};

  if (search?.name) {
    whereClause.name = {
      contains: search.name,
      mode: "insensitive",
    };
  }

  const sortCriteria: Prisma.CategoryOrderByWithRelationInput = sortBy
    ? {
        [sortBy]: sortOrder || "desc",
      }
    : { createdAt: "desc" };

  const categories = await this.categoryRepo.list(
    skip,
    limit,
    whereClause,
    sortCriteria
  );

  const total = await this.categoryRepo.countAll(whereClause);

  return {
    categories,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
};

async getById (id: string): Promise<Category | null> {
  const numId = parseInt(id);
  return await this.categoryRepo.findById(numId);
};

async create (name: string ): Promise<Category> {
  const isExist = await this.categoryRepo.findByName(name);
  if (isExist) throw new Error("Nama kategori sudah ada");

  return await this.categoryRepo.create({ name });
};

async update (id: string, name: string ): Promise<Category>{
  const numId = parseInt(id);
  return await this.categoryRepo.update(numId, { name });
};

async delete (id: string): Promise<Category>{
  const numId = parseInt(id);
  return await this.categoryRepo.delete(numId);
};

async exec() {
  const state = await this.categoryRepo.getStats();
  return { overview: state };
}
}