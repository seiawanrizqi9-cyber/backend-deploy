import type { OrderItem, Prisma, PrismaClient } from "../generated/client.js";
export interface IOrderItemRepository {
    list(skip: number, take: number, where: Prisma.OrderItemWhereInput, orderBy: Prisma.OrderItemOrderByWithRelationInput): Promise<OrderItem[]>;
    countAll(where: Prisma.OrderItemWhereInput): Promise<number>;
    findById(id: number): Promise<OrderItem | null>;
    create(data: Prisma.OrderItemCreateInput): Promise<OrderItem>;
    update(id: number, data: Prisma.OrderItemUpdateInput): Promise<OrderItem>;
    softDelete(id: number): Promise<OrderItem>;
    findComplex(id: number, user_id: number): Promise<OrderItem[]>;
    getStats(): Promise<Prisma.GetOrderItemAggregateType<{
        _count: {
            id: true;
        };
    }>>;
    getOrderItemsByOrder(): Promise<(Prisma.PickEnumerable<Prisma.OrderItemGroupByOutputType, "id"[]> & {
        _count: {
            id: number;
        };
    })[]>;
}
export declare class OrderItemRepository implements IOrderItemRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    list(skip: number, take: number, where: Prisma.OrderItemWhereInput, orderBy: Prisma.OrderItemOrderByWithRelationInput): Promise<OrderItem[]>;
    countAll(where: Prisma.OrderItemWhereInput): Promise<number>;
    findById(id: number): Promise<OrderItem | null>;
    create(data: Prisma.OrderItemCreateInput): Promise<OrderItem>;
    update(id: number, data: Prisma.OrderItemUpdateInput): Promise<OrderItem>;
    softDelete(id: number): Promise<OrderItem>;
    findComplex(id: number, user_id: number): Promise<OrderItem[]>;
    getStats(): Promise<Prisma.GetOrderItemAggregateType<{
        _count: {
            id: true;
        };
        _avg: {
            quantity: true;
        };
        _sum: {
            quantity: true;
        };
        _min: {
            quantity: true;
        };
        _max: {
            quantity: true;
        };
    }>>;
    getOrderItemsByOrder(): Promise<(Prisma.PickEnumerable<Prisma.OrderItemGroupByOutputType, "id"[]> & {
        _count: {
            id: number;
        };
    })[]>;
}
//# sourceMappingURL=orderItems.repository.d.ts.map
