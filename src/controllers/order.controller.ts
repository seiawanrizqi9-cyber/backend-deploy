import type { Request, Response } from "express";
import { successResponse, errorResponse } from "../utils/response";
import type { IOrderService } from "../services/order.service";

export interface IOrderController {
  list: (req: Request, res: Response) => Promise<void>;
  getById: (req: Request, res: Response) => Promise<void>;
  create: (req: Request, res: Response) => Promise<void>;
  update: (req: Request, res: Response) => Promise<void>;
  delete: (req: Request, res: Response) => Promise<void>;
  checkout: (req: Request, res: Response) => Promise<void>;
  getStats: (req: Request, res: Response) => Promise<void>;
}

export class OrderController implements IOrderController {
  constructor(private orderService: IOrderService) {
    this.list = this.list.bind(this);
    this.getById = this.getById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.checkout = this.checkout.bind(this);
    this.getStats = this.getStats.bind(this);
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = req.query.search as any;
      const sortBy = req.query.sortBy as string;
      const sortOrder = (req.query.sortOrder as "asc" | "desc") || "desc";

      let userId: number | undefined;

      // Cek role user untuk filter
      if (req.user && req.user.role !== "ADMIN") {
        userId = req.user.id;
      }

      const result = await this.orderService.list({
        page,
        limit,
        search,
        sortBy,
        sortOrder,
        userId,
      });

      const pagination = {
        page: result.currentPage,
        limit,
        total: result.total,
        totalPages: result.totalPages,
      };

      successResponse(res, "Order berhasil diambil", result.orders, pagination);
    } catch (error: any) {
      errorResponse(res, error.message || "Terjadi kesalahan", 500);
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      if (!req.params.id) {
        throw new Error("Parameter ID tidak ditemukan");
      }

      const order = await this.orderService.findById(req.params.id);
      successResponse(res, "Order berhasil diambil", order);
    } catch (error: any) {
      errorResponse(res, error.message || "Order tidak ditemukan", 404);
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { user_id, total } = req.body;
      
      if (!user_id) {
        throw new Error("User ID wajib diisi");
      }

      const data = {
        user_id: Number(user_id),
        total: total ? Number(total) : 0,
      };

      const order = await this.orderService.create(data);
      successResponse(res, "Order berhasil dibuat", order, null, 201);
    } catch (error: any) {
      errorResponse(res, error.message || "Gagal membuat order", 400);
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      if (!req.params.id) {
        throw new Error("Parameter ID tidak ditemukan");
      }

      const order = await this.orderService.update(req.params.id, req.body);
      successResponse(res, "Order berhasil diupdate", order);
    } catch (error: any) {
      errorResponse(res, error.message || "Gagal mengupdate order", 400);
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      if (!req.params.id) {
        throw new Error("Parameter ID tidak ditemukan");
      }

      const deleted = await this.orderService.delete(req.params.id);
      successResponse(res, "Order berhasil dihapus", deleted);
    } catch (error: any) {
      errorResponse(res, error.message || "Gagal menghapus order", 400);
    }
  }

  async checkout(req: Request, res: Response): Promise<void> {
    try {
      const user_id = req.user?.id;

      if (!user_id) {
        throw new Error("Unauthorized - User tidak ditemukan");
      }

      if (!req.body.orderItems || !Array.isArray(req.body.orderItems) || req.body.orderItems.length === 0) {
        throw new Error("Order items wajib diisi");
      }

      // Validasi setiap order item
      const orderItems = req.body.orderItems.map((item: any) => {
        if (!item.product_id || !item.quantity) {
          throw new Error("Setiap order item harus memiliki product_id dan quantity");
        }
        return {
          product_id: Number(item.product_id),
          quantity: Number(item.quantity),
        };
      });

      const data = {
        user_id,
        orderItems,
      };

      const result = await this.orderService.checkout(data);
      successResponse(res, "Checkout berhasil", result, null, 201);
    } catch (error: any) {
      errorResponse(res, error.message || "Checkout gagal", 400);
    }
  }

  async getStats(_req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.orderService.exec();
      successResponse(res, "Statistik berhasil diambil", stats);
    } catch (error: any) {
      errorResponse(res, error.message || "Terjadi kesalahan", 500);
    }
  }
}