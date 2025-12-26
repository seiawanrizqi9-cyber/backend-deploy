import type { Category, Prisma, PrismaClient } from "../generated/client.js";
export interface ICategoryRepository {
    list(skip: number, take: number, where: Prisma.CategoryWhereInput, orderBy: Prisma.CategoryOrderByWithRelationInput): Promise<Category[]>;
    countAll(where: Prisma.CategoryWhereInput): Promise<number>;
    findById(id: number): Promise<Category | null>;
    findByName(name: string): Promise<Category | null>;
    create(data: Prisma.CategoryCreateInput): Promise<Category>;
    update(id: number, data: Prisma.CategoryUpdateInput): Promise<Category>;
    delete(id: number): Promise<Category>;
    findComplex(categoryName: string, maxPrice: number): Promise<any>;
    getStats(): Promise<Prisma.GetCategoryAggregateType<{
        _count: {
            id: true;
        };
    }>>;
}
export declare class CategoryRepository implements ICategoryRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    list(skip: number, take: number, where: Prisma.CategoryWhereInput, orderBy: Prisma.CategoryOrderByWithRelationInput): Promise<Category[]>;
    countAll(where: Prisma.CategoryWhereInput): Promise<number>;
    findById(id: number): Promise<Category | null>;
    findByName(name: string): Promise<Category | null>;
    create(data: Prisma.CategoryCreateInput): Promise<Category>;
    update(id: number, data: Prisma.CategoryUpdateInput): Promise<Category>;
    delete(id: number): Promise<Category>;
    findComplex(categoryName: string, maxPrice: number): Promise<{
        name: string;
        description: string | null;
        price: Prisma.Decimal;
        stock: number;
        categoryId: number | null;
        id: number;
        image: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }[]>;
    getStats(): Promise<Prisma.GetCategoryAggregateType<{
        _count: {
            id: true;
        };
    }>>;
}
//# sourceMappingURL=category.repository.d.ts.map
