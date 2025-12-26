import type { Request, Response } from "express";
export declare const requestMagicLink: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const verifyMagicToken: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const validateSession: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getUserProfile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=magicLogin.controller.d.ts.map