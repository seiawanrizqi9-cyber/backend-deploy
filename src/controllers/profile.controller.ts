import type { Request, Response } from "express";
import { successResponse, errorResponse } from "../utils/response";
import type { IProfileService } from "../services/profile.service";

export interface IProfileController {
  create: (req: Request, res: Response) => Promise<void>;
  getByUserId: (req: Request, res: Response) => Promise<void>;
  list: (req: Request, res: Response) => Promise<void>;
  getMyProfile: (req: Request, res: Response) => Promise<void>;
  getById: (req: Request, res: Response) => Promise<void>;
  update: (req: Request, res: Response) => Promise<void>;
  delete: (req: Request, res: Response) => Promise<void>;
}

export class ProfileController implements IProfileController {
  constructor(private profileService: IProfileService) {
    this.create = this.create.bind(this);
    this.getByUserId = this.getByUserId.bind(this);
    this.list = this.list.bind(this);
    this.getMyProfile = this.getMyProfile.bind(this);
    this.getById = this.getById.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.getStats = this.getStats.bind(this);
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const user_id = req.user?.id || req.body.user_id;

      if (!user_id) {
        errorResponse(res, "User ID diperlukan", 400);
        return;
      }

      const data = {
        user_id: Number(user_id),
        name: req.body.name,
        gender: req.body.gender,
        address: req.body.address,
        profile_picture_url: req.body.profile_picture_url,
      };

      const profile = await this.profileService.create(data);
      successResponse(res, "Profile berhasil dibuat", profile, null, 201);
    } catch (error: any) {
      errorResponse(res, error.message, 400);
    }
  }

  async getByUserId(req: Request, res: Response): Promise<void> {
    try {
      const userId = Number(req.params.userId);
      const profile = await this.profileService.getByUserId(userId);
      successResponse(res, "Profile berhasil diambil", profile);
    } catch (error: any) {
      errorResponse(res, error.message, 404);
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const profileId = Number(req.params.id);
      const profile = await this.profileService.getById(profileId);
      successResponse(res, "Profile berhasil diambil", profile);
    } catch (error: any) {
      errorResponse(res, error.message, 404);
    }
  }

  async getMyProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        errorResponse(res, "Unauthorized", 401);
        return;
      }

      const profile = await this.profileService.getByUserId(userId);
      successResponse(res, "Profile berhasil diambil", profile);
    } catch (error: any) {
      errorResponse(res, error.message, 404);
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const profileId = Number(req.params.id);
      const data = {
        name: req.body.name,
        gender: req.body.gender,
        address: req.body.address,
        profile_picture_url: req.body.profile_picture_url,
      };

      const updatedProfile = await this.profileService.update(profileId, data);
      successResponse(res, "Profile berhasil diupdate", updatedProfile);
    } catch (error: any) {
      errorResponse(res, error.message, 400);
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const profileId = Number(req.params.id);
      const deletedProfile = await this.profileService.delete(profileId);
      successResponse(res, "Profile berhasil dihapus", deletedProfile);
    } catch (error: any) {
      errorResponse(res, error.message, 400);
    }
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      if (req.user?.role !== "ADMIN") {
        errorResponse(res, "Access denied. Admin only.", 403);
        return;
      }

      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = req.query.search as any;
      const sortBy = req.query.sortBy as string;
      const sortOrder = (req.query.sortOrder as "asc" | "desc") || "desc";

      const result = await this.profileService.list({
        page,
        limit,
        search,
        sortBy,
        sortOrder,
      });

      const pagination = {
        page: result.currentPage,
        limit,
        total: result.total,
        totalPages: result.totalPages,
      };

      successResponse(
        res,
        "Semua profile berhasil diambil",
        result.profiles,
        pagination
      );
    } catch (error: any) {
      errorResponse(res, error.message, 500);
    }
  }

  async getStats(_req: Request, res: Response) {
    const stats = await this.profileService.exec();

    successResponse(res, "Profile berhasil diambil", stats, null, 200);
  }
}
