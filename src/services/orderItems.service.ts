import type { OrderItem, Prisma } from "../generated";
import type { IOrderItemRepository } from "../repository/orderItems.repository";

interface OrderItemsParams {
  page: number;
  limit: number;
  search?: {
    order_id?: number;
    product_id?: number;
    min_quantity?: number;
    max_quantity?: number;
  };
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface OrderItemListResponse {
  orderItems: OrderItem[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface IOrderItemService {
  list(params: OrderItemsParams): Promise<OrderItemListResponse>;
  getById(id: string): Promise<OrderItem>;
  create(data: {
    order_id: number;
    product_id: number;
    quantity: number;
  }): Promise<OrderItem>;
  update(id: string, data: Partial<OrderItem>): Promise<OrderItem>;
  delete(id: string): Promise<OrderItem>;
  exec(): Promise<{ overview: any; byCategory: any }>
}

export class OrderItemService implements IOrderItemService {
  constructor(private orderItemRepo: IOrderItemRepository) {}

  async list(params: OrderItemsParams): Promise<OrderItemListResponse> {
    const { page, limit, search, sortBy, sortOrder } = params;
    const skip = (page - 1) * limit;

    const whereClause: Prisma.OrderItemWhereInput = { deletedAt: null };

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

    const sortCriteria: Prisma.OrderItemOrderByWithRelationInput = sortBy
      ? {
          [sortBy]: sortOrder || "desc",
        }
      : { createdAt: "desc" };

    const orderItems = await this.orderItemRepo.list(
      skip,
      limit,
      whereClause,
      sortCriteria
    );

    const total = await this.orderItemRepo.countAll(whereClause);

    return {
      orderItems,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  async getById(id: string): Promise<OrderItem> {
    const numId = parseInt(id);
    const orderItem = await this.orderItemRepo.findById(numId);

    if (!orderItem) {
      throw new Error("Order item tidak ditemukan");
    }

    return orderItem;
  }

  async create(data: {
    order_id: number;
    product_id: number;
    quantity: number;
  }): Promise<OrderItem> {
    const createData: Prisma.OrderItemCreateInput = {
      order: { connect: { id: data.order_id } },  
      product: { connect: { id: data.product_id } }, 
      quantity: data.quantity,
    };

    return await this.orderItemRepo.create(createData);
  }

  async update(id: string, data: Partial<OrderItem>): Promise<OrderItem> {
    // Periksa apakah order item ada
    await this.getById(id);
    
    const numId = parseInt(id);
    return await this.orderItemRepo.update(numId, data as Prisma.OrderItemUpdateInput);
  }

  async delete(id: string): Promise<OrderItem> {
    const numId = parseInt(id);
    return await this.orderItemRepo.softDelete(numId);
  }

  async exec () {
    const state = await this.orderItemRepo.getStats();
    const category = await this.orderItemRepo.getOrderItemsByOrder();

    return { overview: state, byCategory: category };
  }
}