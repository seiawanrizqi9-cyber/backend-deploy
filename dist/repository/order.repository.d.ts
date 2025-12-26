import type { Prisma, Order, PrismaClient } from "../generated/client.js";
export interface IOrderRepository {
    create(data: Prisma.OrderCreateInput): Promise<Order>;
    update(id: number, data: Prisma.OrderUpdateInput): Promise<Order>;
    softDelete(id: number): Promise<Order>;
    list(skip: number, take: number, where: Prisma.OrderWhereInput, orderBy: Prisma.OrderOrderByWithRelationInput): Promise<Order[]>;
    countAll(where: Prisma.OrderWhereInput): Promise<number>;
    findById(id: number): Promise<Order | null>;
    findComplex(id: number, user_id: number): Promise<Order[]>;
    getStats(): Promise<Prisma.GetOrderAggregateType<{
        _count: {
            id: true;
        };
    }>>;
    getOrderById(): Promise<(Prisma.PickEnumerable<Prisma.OrderGroupByOutputType, "id"[]> & {
        _count: {
            id: number;
        };
    })[]>;
}
export declare class OrderRepository implements IOrderRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    list(skip: number, take: number, where: Prisma.OrderWhereInput, orderBy: Prisma.OrderOrderByWithRelationInput): Promise<Order[]>;
    countAll(where: Prisma.OrderWhereInput): Promise<number>;
    findById(id: number): Promise<Order | null>;
    create(data: Prisma.OrderCreateInput): Promise<Order>;
    update(id: number, data: Prisma.OrderUpdateInput): Promise<Order>;
    softDelete(id: number): Promise<Order>;
    findComplex(id: number, user_id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        total: Prisma.Decimal;
        user_id: number;
    }[]>;
    getStats(): Promise<Prisma.GetOrderAggregateType<{
        _count: {
            id: true;
        };
        _avg: {
            total: true;
        };
        _sum: {
            total: true;
        };
        _min: {
            total: true;
        };
        _max: {
            total: true;
        };
    }>>;
    getOrderById(): Promise<(Prisma.PickEnumerable<Prisma.OrderGroupByOutputType, "id"[]> & {
        _count: {
            id: number;
        };
    })[]>;
}
//# sourceMappingURL=order.repository.d.ts.map
