import type { Category, Prisma, PrismaClient, Product } from "../generated/client.js";
import type { Decimal } from "../generated/runtime/client";
export interface CategoryStats {
    categoryId: number;
    productCount: number;
    averagePrice: Decimal | number;
}
export interface IProductRepository {
    list(skip: number, take: number, where: Prisma.ProductWhereInput, orderBy: Prisma.ProductOrderByWithRelationInput): Promise<Product[]>;
    countAll(where: Prisma.ProductWhereInput): Promise<number>;
    findById(id: number): Promise<(Product & {
        category: Category | null;
    }) | null>;
    create(data: Prisma.ProductCreateInput): Promise<Product>;
    update(id: number, data: Prisma.ProductUpdateInput): Promise<Product>;
    softDelete(id: number): Promise<Product>;
    findComplex(categoryName: string, maxPrice: number): Promise<Product[]>;
    getStats(): Promise<Prisma.GetProductAggregateType<{
        _count: {
            id: true;
        };
        _avg: {
            price: true;
        };
        _sum: {
            price: true;
        };
        _min: {
            price: true;
        };
        _max: {
            price: true;
        };
    }>>;
    getProductsByCategoryStats(): Promise<(Prisma.PickEnumerable<Prisma.ProductGroupByOutputType, "categoryId"[]> & {
        _avg: {
            price: Decimal | null;
        };
        _count: {
            id: number;
        };
    })[]>;
}
export declare class ProductRepository implements IProductRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    list(skip: number, take: number, where: Prisma.ProductWhereInput, orderBy: Prisma.ProductOrderByWithRelationInput): Promise<Product[]>;
    countAll(where: Prisma.ProductWhereInput): Promise<number>;
    findById(id: number): Promise<(Product & {
        category: Category | null;
    }) | null>;
    create(data: Prisma.ProductCreateInput): Promise<Product>;
    update(id: number, data: Prisma.ProductUpdateInput): Promise<Product>;
    softDelete(id: number): Promise<Product>;
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
    getStats(): Promise<Prisma.GetProductAggregateType<{
        _count: {
            id: true;
        };
        _avg: {
            price: true;
        };
        _sum: {
            price: true;
        };
        _min: {
            price: true;
        };
        _max: {
            price: true;
        };
    }>>;
    getProductsByCategoryStats(): Promise<(Prisma.PickEnumerable<Prisma.ProductGroupByOutputType, "categoryId"[]> & {
        _count: {
            id: number;
        };
        _avg: {
            price: Prisma.Decimal | null;
        };
    })[]>;
}
//# sourceMappingURL=product.repository.d.ts.map
