import type { Request, Response } from "express";
import type { IOrderItemService } from "../services/orderItems.service.js";
export interface IOrderItemController {
    list: (req: Request, res: Response) => Promise<void>;
    getById: (req: Request, res: Response) => Promise<void>;
    create: (req: Request, res: Response) => Promise<void>;
    update: (req: Request, res: Response) => Promise<void>;
    delete: (req: Request, res: Response) => Promise<void>;
    getStats: (req: Request, res: Response) => Promise<void>;
}
export declare class OrderItemController implements IOrderItemController {
    private orderItemService;
    constructor(orderItemService: IOrderItemService);
    list(req: Request, res: Response): Promise<void>;
    getById(req: Request, res: Response): Promise<void>;
    create(req: Request, res: Response): Promise<void>;
    update(req: Request, res: Response): Promise<void>;
    delete(req: Request, res: Response): Promise<void>;
    getStats(_req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=orderItems.controller.d.ts.map
