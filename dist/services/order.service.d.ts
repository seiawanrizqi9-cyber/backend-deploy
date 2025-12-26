import type { Order, OrderItem } from "../generated/client";
export interface createOrder {
    user_id: number;
    total: number;
    orderItems: OrderItem[];
}
export interface orderItem {
    product_id: number;
    quantity: number;
}
export declare const getAllOrders: () => Promise<{
    orders: Order[];
    total: number;
}>;
export declare const getOrderById: (id: string) => Promise<Order>;
export declare const createOrder: (data: {
    user_id: number;
    total?: number;
}) => Promise<Order>;
export declare const updateOrder: (id: string, data: Partial<Order>) => Promise<Order>;
export declare const checkout: (data: createOrder) => Promise<{
    id: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    total: import("@prisma/client-runtime-utils").Decimal;
    user_id: number;
}>;
export declare const deleteOrder: (id: string) => Promise<Order>;
//# sourceMappingURL=order.service.d.ts.map