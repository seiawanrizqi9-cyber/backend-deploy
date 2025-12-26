import type { Prisma, PrismaClient, Profile } from "../generated/client.js";
export interface IProfileRepository {
    list: (skip: number, take: number, where: Prisma.ProfileWhereInput, orderBy: Prisma.ProfileOrderByWithRelationInput) => Promise<Profile[]>;
    countAll: (where: Prisma.ProfileWhereInput) => Promise<number>;
    findById: (id: number) => Promise<Profile | null>;
    findByUserId: (userId: number) => Promise<Profile | null>;
    create: (data: Prisma.ProfileCreateInput) => Promise<Profile>;
    update: (id: number, data: Prisma.ProfileUpdateInput) => Promise<Profile>;
    softDelete: (id: number) => Promise<Profile>;
    findComplex: (name: string, user_id: number) => Promise<Profile[]>;
    getStats(): Promise<Prisma.GetProfileAggregateType<{
        _count: {
            id: true;
        };
    }>>;
    getProfileByCategoryStats(): Promise<(Prisma.PickEnumerable<Prisma.ProfileGroupByOutputType, "id"[]> & {
        _count: {
            id: number;
        };
    })[]>;
}
export declare class ProfileRepository implements IProfileRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    list(skip: number, take: number, where: Prisma.ProfileWhereInput, orderBy: Prisma.ProfileOrderByWithRelationInput): Promise<({
        user: {
            id: number;
            createdAt: Date;
            email: string;
            username: string;
            role: string;
        };
    } & {
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        user_id: number;
        gender: string | null;
        address: string | null;
        profile_picture_url: string | null;
    })[]>;
    countAll(where: Prisma.ProfileWhereInput): Promise<number>;
    findById(id: number): Promise<({
        user: {
            id: number;
            email: string;
            username: string;
            role: string;
        };
    } & {
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        user_id: number;
        gender: string | null;
        address: string | null;
        profile_picture_url: string | null;
    }) | null>;
    findByUserId(userId: number): Promise<({
        user: {
            id: number;
            email: string;
            username: string;
            role: string;
        };
    } & {
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        user_id: number;
        gender: string | null;
        address: string | null;
        profile_picture_url: string | null;
    }) | null>;
    create(data: Prisma.ProfileCreateInput): Promise<{
        user: {
            id: number;
            email: string;
            username: string;
            role: string;
        };
    } & {
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        user_id: number;
        gender: string | null;
        address: string | null;
        profile_picture_url: string | null;
    }>;
    update(id: number, data: Prisma.ProfileUpdateInput): Promise<{
        user: {
            id: number;
            email: string;
            username: string;
            role: string;
        };
    } & {
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        user_id: number;
        gender: string | null;
        address: string | null;
        profile_picture_url: string | null;
    }>;
    softDelete(id: number): Promise<{
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        user_id: number;
        gender: string | null;
        address: string | null;
        profile_picture_url: string | null;
    }>;
    findComplex(name: string, user_id: number): Promise<{
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        user_id: number;
        gender: string | null;
        address: string | null;
        profile_picture_url: string | null;
    }[]>;
    getStats(): Promise<Prisma.GetProfileAggregateType<{
        _count: {
            id: true;
        };
    }>>;
    getProfileByCategoryStats(): Promise<(Prisma.PickEnumerable<Prisma.ProfileGroupByOutputType, "id"[]> & {
        _count: {
            id: number;
        };
    })[]>;
}
//# sourceMappingURL=profile.repository.d.ts.map
