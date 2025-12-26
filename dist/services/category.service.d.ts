export declare const getAllCategories: () => Promise<{
    name: string;
    id: number;
    createdAt: Date;
    updatedAt: Date;
}[]>;
export declare const getCategoryById: (id: string) => Promise<{
    name: string;
    id: number;
    createdAt: Date;
    updatedAt: Date;
} | null>;
export declare const createCategory: (name: string) => Promise<{
    name: string;
    id: number;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const categoryUpdate: (id: string, name: string) => Promise<{
    name: string;
    id: number;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const removeCategory: (id: string) => Promise<{
    name: string;
    id: number;
    createdAt: Date;
    updatedAt: Date;
}>;
//# sourceMappingURL=category.service.d.ts.map