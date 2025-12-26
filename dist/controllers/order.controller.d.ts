import type { Request, Response } from "express";
export interface orderRequest extends Request {
    user_id: number;
    total: number;
    orderItems: orderItem[];
}
export interface orderItem {
    product_id: number;
    quantity: number;
}
export declare const getAll: (_req: Request, res: Response) => Promise<void>;
export declare const getById: (req: Request, res: Response) => Promise<void>;
export declare const create: (req: Request, res: Response) => Promise<void>;
export declare const update: (req: Request, res: Response) => Promise<void>;
export declare const remove: (req: Request, res: Response) => Promise<void>;
export declare const checkout: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=order.controller.d.ts.map