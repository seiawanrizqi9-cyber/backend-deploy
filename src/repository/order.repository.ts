import type { Prisma, Order, PrismaClient } from "../generated/client";

export interface IOrderRepository {
  create(data: Prisma.OrderCreateInput): Promise<Order>;
  update(id: number, data: Prisma.OrderUpdateInput): Promise<Order>;
  softDelete(id: number): Promise<Order>;
  list(
    skip: number,
    take: number,
    where: Prisma.OrderWhereInput,
    orderBy: Prisma.OrderOrderByWithRelationInput
  ): Promise<Order[]>;
  countAll(where: Prisma.OrderWhereInput): Promise<number>;
  findById(id: number): Promise<Order | null>;
  findComplex(id: number, user_id: number): Promise<Order[]>;
  getStats(): Promise<Prisma.GetOrderAggregateType<{ _count: { id: true } }>>;
  getOrderById(): Promise<(Prisma.PickEnumerable<Prisma.OrderGroupByOutputType, "id"[]> & {
    _count: {
        id: number;
    };
})[]>
}

export class OrderRepository implements IOrderRepository {
  constructor(private prisma: PrismaClient) {}

  async list(
    skip: number,
    take: number,
    where: Prisma.OrderWhereInput,
    orderBy: Prisma.OrderOrderByWithRelationInput
  ): Promise<Order[]> {
    return await this.prisma.order.findMany({
      skip,
      take,
      where,
      orderBy,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        orderItems: {
          include: {
            product: {
              select: {
                name: true,
                price: true,
              },
            },
          },
        },
      },
    });
  }

  async countAll(where: Prisma.OrderWhereInput): Promise<number> {
    return await this.prisma.order.count({ where });
  }

  async findById(id: number): Promise<Order | null> {
    return await this.prisma.order.findUnique({
      where: { id, deletedAt: null },
      include: {
        user: { select: { username: true, email: true } },
        orderItems: {
          include: {
            product: { select: { name: true, price: true } },
          },
        },
      },
    });
  }

  async create(data: Prisma.OrderCreateInput): Promise<Order> {
    return await this.prisma.order.create({ data });
  }

  async update(id: number, data: Prisma.OrderUpdateInput): Promise<Order> {
    return await this.prisma.order.update({
      where: { id, deletedAt: null },
      data,
    });
  }

  async softDelete(id: number): Promise<Order> {
    return await this.prisma.order.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async findComplex(id: number, user_id: number) {
    return await this.prisma.order.findMany({
      where: {
        OR: [{ id }, { user_id }],
      },
    });
  }

  async getStats() {
    return await this.prisma.order.aggregate({
      _count: {
        id: true,
      },
      _avg: {
        total: true,
      },
      _sum: {
        total: true,
      },
      _min: {
        total: true,
      },
      _max: {
        total: true,
      },
    });
  }

  async getOrderById() {
    return await this.prisma.order.groupBy({
      by: ["id"],
      _count: {
        id: true,
      },
    });
  }
}
