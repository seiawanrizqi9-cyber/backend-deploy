import type { Prisma, Order, PrismaClient } from "../generated/client.js";
import type { IOrderRepository } from "../repository/order.repository.js";
interface FindAllParams {
    page: number;
    limit: number;
    search?: {
        min_total?: number;
        max_total?: number;
    };
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    userId?: number | undefined;
}
interface OrderListResponse {
    orders: Order[];
    total: number;
    totalPages: number;
    currentPage: number;
}
interface OrderDetailResponse {
    id: number;
    customer: string;
    email: string;
    total: number;
    tanggal: Date;
    items: Array<{
        produk: string;
        harga_satuan: number;
        jumlah: number;
    }>;
}
interface CheckoutResponse {
    order_id: number;
    user: {
        id: number;
        username: string;
        email: string;
    };
    total: number;
    items: Array<{
        product_id: number;
        product_name: string;
        price: number;
        quantity: number;
        subtotal: number;
    }>;
    total_items: number;
    created_at: Date;
}
export interface IOrderService {
    list(params: FindAllParams): Promise<OrderListResponse>;
    findById(id: string): Promise<OrderDetailResponse>;
    create(data: Prisma.OrderCreateInput): Promise<Order>;
    update(id: string, data: Prisma.OrderUpdateInput): Promise<Order>;
    delete(id: string): Promise<Order>;
    checkout(data: {
        orderItems: Array<{
            product_id: number;
            quantity: number;
        }>;
        user_id: number;
    }): Promise<CheckoutResponse>;
    exec(): Promise<{
        overview: any;
        byCategory: any;
    }>;
}
export declare class OrderService implements IOrderService {
    private orderRepo;
    private prisma;
    constructor(orderRepo: IOrderRepository, prisma: PrismaClient);
    list(params: FindAllParams): Promise<OrderListResponse>;
    findById(id: string): Promise<OrderDetailResponse>;
    create(data: Prisma.OrderCreateInput): Promise<Order>;
    update(id: string, data: Prisma.OrderUpdateInput): Promise<Order>;
    delete(id: string): Promise<Order>;
    checkout(data: {
        orderItems: Array<{
            product_id: number;
            quantity: number;
        }>;
        user_id: number;
    }): Promise<CheckoutResponse>;
    exec(): Promise<{
        overview: Prisma.GetOrderAggregateType<{
            _count: {
                id: true;
            };
        }>;
        byCategory: (Prisma.PickEnumerable<Prisma.OrderGroupByOutputType, "id"[]> & {
            _count: {
                id: number;
            };
        })[];
    }>;
}
export {};
//# sourceMappingURL=order.service.d.ts.map
