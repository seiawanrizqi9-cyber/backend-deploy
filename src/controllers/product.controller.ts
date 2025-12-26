import type { Request, Response } from "express";
import { successResponse } from "../utils/response";
import type { IProductService } from "../services/product.service";

export interface IProductController {
  list: (req: Request, res: Response) => Promise<void>;
  getById: (req: Request, res: Response) => Promise<void>;
  create: (req: Request, res: Response) => Promise<void>;
  update: (req: Request, res: Response) => Promise<void>;
  delete: (req: Request, res: Response) => Promise<void>;
  getStats: (req: Request, res: Response) => Promise<void>;
}

export class ProductController implements IProductController {
  constructor(private productService: IProductService) {
    this.list = this.list.bind(this);
    this.getById = this.getById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.getStats = this.getStats.bind(this);
  }

async list(req: Request, res: Response) {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search as any;
  const sortBy = req.query.sortBy as string;
  const sortOrder = (req.query.sortOrder as "asc" | "desc") || "desc";

  const result = await this.productService.list({
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

  successResponse(res, "Produk berhasil diambil", result.products, pagination);
};

async getById (req: Request, res: Response) {
  if (!req.params.id) {
    throw new Error("Paramnya gk ada wok");
  }

  const product = await this.productService.getById(req.params.id);

  successResponse(res, "Produk berhasil diambil", product);
};

async create (req: Request, res: Response)  {
  const file = req.file;
  if (!file) throw new Error("image not found");

  const { name, description, price, stock } = req.body;

  const imageUrl = `/public/uploads/${file.filename}`;

  const data = {
    name: name.toString(),
    ...(description && { description: description }),
    price: Number(price),
    categoryId: Number(req.body.categoryId),
    stock: Number(stock),
    image: imageUrl,
  };

  const products = await this.productService.create(data);

  successResponse(res, "Produk berhasil ditambahkan", products, null, 201);
};

async update(req: Request, res: Response)  {
  const product = await this.productService.update(req.params.id!, req.body);

  successResponse(res, "Produk berhasil diupdate", product);
};

async delete (req: Request, res: Response)  {
  const deleted = await this.productService.delete(req.params.id!);

  successResponse(res, "Produk berhasil dihapus", deleted);
};

async getStats(_req: Request, res: Response) {
  const stats = await this.productService.exec();

  successResponse(res, "Produk berhasil diambil", stats, null, 200);
}
}
