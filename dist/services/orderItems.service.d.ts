import type { OrderItem } from "../generated/client";
export declare const getAllOrderItems: () => Promise<{
    orderItems: OrderItem[];
    total: number;
}>;
export declare const getOrderItemById: (id: string) => Promise<OrderItem>;
export declare const createOrderItem: (data: {
    order_id: number;
    product_id: number;
    quantity: number;
}) => Promise<OrderItem>;
export declare const updateOrderItem: (id: string, data: Partial<OrderItem>) => Promise<OrderItem>;
export declare const deleteOrderItem: (id: string) => Promise<OrderItem>;
//# sourceMappingURL=orderItems.service.d.ts.map