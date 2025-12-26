import type { Category, Prisma, Product } from "../generated";
import type { IProductRepository } from "../repository/product.repository";

interface FindAllParams {
  page: number;
  limit: number;
  search?: {
    name?: string;
    min_price?: number;
    max_price?: number;
  };
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface ProductListResponse {
  products: Product[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface IProductService {
  list(params: FindAllParams): Promise<ProductListResponse>;
  getById(
    id: string
  ): Promise<(Product & { category: Category | null }) | null>;
  create(data: {
    name: string;
    description?: string;
    price: number;
    stock: number;
    categoryId?: number;
    image: string;
  }): Promise<Product>;
  update(id: string, data: Partial<Product>): Promise<Product>;
  delete(id: string): Promise<Product>;
  exec(): Promise<{ overview: any; byCategory: any }>;
}

export class ProductService implements IProductService {
  constructor(private productRepo: IProductRepository) {}

  async list(params: FindAllParams): Promise<ProductListResponse> {
    const { page, limit, search, sortBy, sortOrder } = params;
    const skip = (page - 1) * limit;

    const whereClause: Prisma.ProductWhereInput = {
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

    const sortCriteria: Prisma.ProductOrderByWithRelationInput = sortBy
      ? {
          [sortBy]: sortOrder || "desc",
        }
      : { createdAt: "desc" };

    const products = await this.productRepo.list(
      skip,
      limit,
      whereClause,
      sortCriteria
    );

    const total = await this.productRepo.countAll(whereClause);

    return {
      products,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  async getById(
    id: string
  ): Promise<(Product & { category: Category | null }) | null> {
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

  async create(data: {
    name: string;
    description?: string;
    price: number;
    stock: number;
    categoryId?: number;
    image: string;
  }): Promise<Product> {
    return await this.productRepo.create(data);
  }

  async update(id: string, data: Partial<Product>): Promise<Product> {
    await this.getById(id);

    const numId = Number(id);
    if (isNaN(numId)) {
      throw new Error("ID harus berupa angka");
    }

    return await this.productRepo.update(numId, data);
  }

  async delete(id: string): Promise<Product> {
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
