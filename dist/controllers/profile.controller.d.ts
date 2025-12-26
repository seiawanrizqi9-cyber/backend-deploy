import type { Request, Response } from "express";
import type { IProfileService } from "../services/profile.service.js";
export interface IProfileController {
    create: (req: Request, res: Response) => Promise<void>;
    getByUserId: (req: Request, res: Response) => Promise<void>;
    list: (req: Request, res: Response) => Promise<void>;
    getMyProfile: (req: Request, res: Response) => Promise<void>;
    getById: (req: Request, res: Response) => Promise<void>;
    update: (req: Request, res: Response) => Promise<void>;
    delete: (req: Request, res: Response) => Promise<void>;
}
export declare class ProfileController implements IProfileController {
    private profileService;
    constructor(profileService: IProfileService);
    create(req: Request, res: Response): Promise<void>;
    getByUserId(req: Request, res: Response): Promise<void>;
    getById(req: Request, res: Response): Promise<void>;
    getMyProfile(req: Request, res: Response): Promise<void>;
    update(req: Request, res: Response): Promise<void>;
    delete(req: Request, res: Response): Promise<void>;
    list(req: Request, res: Response): Promise<void>;
    getStats(_req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=profile.controller.d.ts.map
