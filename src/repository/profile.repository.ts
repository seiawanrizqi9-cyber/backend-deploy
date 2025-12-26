import type { Prisma, PrismaClient, Profile } from "../generated/client";

export interface IProfileRepository {
  list: (
    skip: number,
    take: number,
    where: Prisma.ProfileWhereInput,
    orderBy: Prisma.ProfileOrderByWithRelationInput
  ) => Promise<Profile[]>;
  countAll: (where: Prisma.ProfileWhereInput) => Promise<number>;
  findById: (id: number) => Promise<Profile | null>;
  findByUserId: (userId: number) => Promise<Profile | null>;
  create: (data: Prisma.ProfileCreateInput) => Promise<Profile>;
  update: (id: number, data: Prisma.ProfileUpdateInput) => Promise<Profile>;
  softDelete: (id: number) => Promise<Profile>;
  findComplex: (name: string, user_id: number) => Promise<Profile[]>;
  getStats(): Promise<Prisma.GetProfileAggregateType<{ _count: { id: true } }>>;
  getProfileByCategoryStats(): Promise<
    (Prisma.PickEnumerable<Prisma.ProfileGroupByOutputType, "id"[]> & {
      _count: {
        id: number;
      };
    })[]
  >;
}

export class ProfileRepository implements IProfileRepository {
  constructor(private prisma: PrismaClient) {}

  async list(
    skip: number,
    take: number,
    where: Prisma.ProfileWhereInput,
    orderBy: Prisma.ProfileOrderByWithRelationInput
  ) {
    return await this.prisma.profile.findMany({
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
            role: true,
            createdAt: true,
          },
        },
      },
    });
  }

  async countAll(where: Prisma.ProfileWhereInput) {
    return await this.prisma.profile.count({ where });
  }

  async findById(id: number) {
    return await this.prisma.profile.findUnique({
      where: { id, deletedAt: null },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  async findByUserId(userId: number) {
    return await this.prisma.profile.findUnique({
      where: { user_id: userId, deletedAt: null },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  async create(data: Prisma.ProfileCreateInput) {
    return await this.prisma.profile.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  async update(id: number, data: Prisma.ProfileUpdateInput) {
    return await this.prisma.profile.update({
      where: { id, deletedAt: null },
      data,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  async softDelete(id: number) {
    return await this.prisma.profile.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async findComplex(name: string, user_id: number) {
    return await this.prisma.profile.findMany({
      where: {
        OR: [{ name: { contains: name } }, { user: { id: user_id } }],
      },
    });
  }

  async getStats() {
    return await this.prisma.profile.aggregate({
      _count: {
        id: true,
      },
    });
  }

  async getProfileByCategoryStats() {
    return await this.prisma.profile.groupBy({
      by: ["id"],
      _count: {
        id: true,
      },
    });
  }
}
