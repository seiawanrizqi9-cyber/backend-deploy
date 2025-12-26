import type { Request, Response } from "express";
import type { ICategoryService } from "../services/category.service.js";
export interface ICategoryController {
    list: (req: Request, res: Response) => Promise<void>;
    create: (req: Request, res: Response) => Promise<void>;
    getById: (req: Request, res: Response) => Promise<void>;
    update: (req: Request, res: Response) => Promise<void>;
    delete: (req: Request, res: Response) => Promise<void>;
}
export declare class CategoryController implements ICategoryController {
    private categoryService;
    constructor(categoryService: ICategoryService);
    list(req: Request, res: Response): Promise<void>;
    create(req: Request, res: Response): Promise<void>;
    getById(req: Request, res: Response): Promise<void>;
    update(req: Request, res: Response): Promise<void>;
    delete(req: Request, res: Response): Promise<void>;
    getStats(_req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=category.controller.d.ts.map
