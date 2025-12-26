import type { OrderItem, Prisma, PrismaClient } from "../generated";

export interface IOrderItemRepository {
  list(
    skip: number,
    take: number,
    where: Prisma.OrderItemWhereInput,
    orderBy: Prisma.OrderItemOrderByWithRelationInput
  ): Promise<OrderItem[]>;
  countAll(where: Prisma.OrderItemWhereInput): Promise<number>;
  findById(id: number): Promise<OrderItem | null>;
  create(data: Prisma.OrderItemCreateInput): Promise<OrderItem>;
  update(id: number, data: Prisma.OrderItemUpdateInput): Promise<OrderItem>;
  softDelete(id: number): Promise<OrderItem>;
  findComplex(id: number, user_id: number): Promise<OrderItem[]>;
  getStats(): Promise<
    Prisma.GetOrderItemAggregateType<{ _count: { id: true } }>
  >;
  getOrderItemsByOrder(): Promise<
    (Prisma.PickEnumerable<Prisma.OrderItemGroupByOutputType, "id"[]> & {
      _count: {
        id: number;
      };
    })[]
  >;
}

export class OrderItemRepository implements IOrderItemRepository {
  constructor(private prisma: PrismaClient) {}

  async list(
    skip: number,
    take: number,
    where: Prisma.OrderItemWhereInput,
    orderBy: Prisma.OrderItemOrderByWithRelationInput
  ): Promise<OrderItem[]> {
    return await this.prisma.orderItem.findMany({
      skip,
      take,
      where,
      orderBy,
      include: {
        order: {
          select: {
            id: true,
            total: true,
            user: {
              select: {
                username: true,
                email: true,
              },
            },
          },
        },
        product: {
          select: {
            name: true,
            price: true,
            image: true,
          },
        },
      },
    });
  }

  async countAll(where: Prisma.OrderItemWhereInput): Promise<number> {
    return await this.prisma.orderItem.count({ where });
  }

  async findById(id: number): Promise<OrderItem | null> {
    return await this.prisma.orderItem.findUnique({
      where: { id, deletedAt: null },
      include: { product: true, order: true },
    });
  }

  async create(data: Prisma.OrderItemCreateInput): Promise<OrderItem> {
    return await this.prisma.orderItem.create({ data });
  }

  async update(
    id: number,
    data: Prisma.OrderItemUpdateInput
  ): Promise<OrderItem> {
    return await this.prisma.orderItem.update({
      where: { id, deletedAt: null },
      data,
    });
  }

  async softDelete(id: number): Promise<OrderItem> {
    return await this.prisma.orderItem.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async findComplex(id: number, user_id: number): Promise<OrderItem[]> {
    return await this.prisma.orderItem.findMany({
      where: { id, order: { user_id } },
    });
  }

  async getStats() {
    return await this.prisma.orderItem.aggregate({
      _count: {
        id: true,
      },
      _avg: {
        quantity: true,
      },
      _sum: {
        quantity: true,
      },
      _min: {
        quantity: true,
      },
      _max: {
        quantity: true,
      },
    });
  }

  async getOrderItemsByOrder() {
    return await this.prisma.orderItem.groupBy({
      by: ["id"],
      _count: {
        id: true,
      },
    });
  }
}
