import { successResponse, errorResponse } from "../utils/response.js";
export class ProfileController {
    profileService;
    constructor(profileService) {
        this.profileService = profileService;
        this.create = this.create.bind(this);
        this.getByUserId = this.getByUserId.bind(this);
        this.list = this.list.bind(this);
        this.getMyProfile = this.getMyProfile.bind(this);
        this.getById = this.getById.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.getStats = this.getStats.bind(this);
    }
    async create(req, res) {
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
        }
        catch (error) {
            errorResponse(res, error.message, 400);
        }
    }
    async getByUserId(req, res) {
        try {
            const userId = Number(req.params.userId);
            const profile = await this.profileService.getByUserId(userId);
            successResponse(res, "Profile berhasil diambil", profile);
        }
        catch (error) {
            errorResponse(res, error.message, 404);
        }
    }
    async getById(req, res) {
        try {
            const profileId = Number(req.params.id);
            const profile = await this.profileService.getById(profileId);
            successResponse(res, "Profile berhasil diambil", profile);
        }
        catch (error) {
            errorResponse(res, error.message, 404);
        }
    }
    async getMyProfile(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                errorResponse(res, "Unauthorized", 401);
                return;
            }
            const profile = await this.profileService.getByUserId(userId);
            successResponse(res, "Profile berhasil diambil", profile);
        }
        catch (error) {
            errorResponse(res, error.message, 404);
        }
    }
    async update(req, res) {
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
        }
        catch (error) {
            errorResponse(res, error.message, 400);
        }
    }
    async delete(req, res) {
        try {
            const profileId = Number(req.params.id);
            const deletedProfile = await this.profileService.delete(profileId);
            successResponse(res, "Profile berhasil dihapus", deletedProfile);
        }
        catch (error) {
            errorResponse(res, error.message, 400);
        }
    }
    async list(req, res) {
        try {
            if (req.user?.role !== "ADMIN") {
                errorResponse(res, "Access denied. Admin only.", 403);
                return;
            }
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const search = req.query.search;
            const sortBy = req.query.sortBy;
            const sortOrder = req.query.sortOrder || "desc";
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
            successResponse(res, "Semua profile berhasil diambil", result.profiles, pagination);
        }
        catch (error) {
            errorResponse(res, error.message, 500);
        }
    }
    async getStats(_req, res) {
        const stats = await this.profileService.exec();
        successResponse(res, "Profile berhasil diambil", stats, null, 200);
    }
}
//# sourceMappingURL=profile.controller.js.map
