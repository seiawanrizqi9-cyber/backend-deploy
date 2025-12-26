import type { OrderItem, Prisma } from "../generated/client.js";
import type { IOrderItemRepository } from "../repository/orderItems.repository.js";
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
    exec(): Promise<{
        overview: any;
        byCategory: any;
    }>;
}
export declare class OrderItemService implements IOrderItemService {
    private orderItemRepo;
    constructor(orderItemRepo: IOrderItemRepository);
    list(params: OrderItemsParams): Promise<OrderItemListResponse>;
    getById(id: string): Promise<OrderItem>;
    create(data: {
        order_id: number;
        product_id: number;
        quantity: number;
    }): Promise<OrderItem>;
    update(id: string, data: Partial<OrderItem>): Promise<OrderItem>;
    delete(id: string): Promise<OrderItem>;
    exec(): Promise<{
        overview: Prisma.GetOrderItemAggregateType<{
            _count: {
                id: true;
            };
        }>;
        byCategory: (Prisma.PickEnumerable<Prisma.OrderItemGroupByOutputType, "id"[]> & {
            _count: {
                id: number;
            };
        })[];
    }>;
}
export {};
//# sourceMappingURL=orderItems.service.d.ts.map
