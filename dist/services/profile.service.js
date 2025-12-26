export class ProfileService {
    profileRepo;
    prisma;
    constructor(profileRepo, prisma) {
        this.profileRepo = profileRepo;
        this.prisma = prisma;
    }
    async create(data) {
        const existingProfile = await this.profileRepo.findByUserId(data.user_id);
        if (existingProfile) {
            throw new Error("User sudah memiliki profile");
        }
        const user = await this.prisma.user.findUnique({
            where: { id: data.user_id, deletedAt: null },
        });
        if (!user) {
            throw new Error("User tidak ditemukan");
        }
        const createData = {
            user: { connect: { id: data.user_id } },
            name: data.name,
            gender: data.gender ? data.gender.toUpperCase() : null,
            address: data.address || null,
            profile_picture_url: data.profile_picture_url || null,
        };
        return await this.profileRepo.create(createData);
    }
    async getByUserId(userId) {
        const profile = await this.profileRepo.findByUserId(userId);
        if (!profile) {
            throw new Error("Profile tidak ditemukan");
        }
        return profile;
    }
    async getById(profileId) {
        const profile = await this.profileRepo.findById(profileId);
        if (!profile) {
            throw new Error("Profile tidak ditemukan");
        }
        return profile;
    }
    async update(profileId, data) {
        const profile = await this.profileRepo.findById(profileId);
        if (!profile) {
            throw new Error("Profile tidak ditemukan");
        }
        const updateData = {
            updatedAt: new Date(),
        };
        if (data.name !== undefined) {
            updateData.name = data.name;
        }
        if (data.gender !== undefined) {
            updateData.gender = data.gender ? data.gender.toUpperCase() : null;
        }
        if (data.address !== undefined) {
            updateData.address = data.address || null;
        }
        if (data.profile_picture_url !== undefined) {
            updateData.profile_picture_url = data.profile_picture_url || null;
        }
        return await this.profileRepo.update(profileId, updateData);
    }
    async delete(profileId) {
        const profile = await this.profileRepo.findById(profileId);
        if (!profile) {
            throw new Error("Profile tidak ditemukan");
        }
        return await this.profileRepo.softDelete(profileId);
    }
    async list(params) {
        const { page, limit, search, sortBy, sortOrder } = params;
        const skip = (page - 1) * limit;
        const whereClause = {
            deletedAt: null,
        };
        if (search?.name) {
            whereClause.name = {
                contains: search.name,
                mode: "insensitive",
            };
        }
        if (search?.gender) {
            whereClause.gender = search.gender.toUpperCase();
        }
        if (search?.address) {
            whereClause.address = {
                contains: search.address,
                mode: "insensitive",
            };
        }
        const sortCriteria = sortBy
            ? {
                [sortBy]: sortOrder || "desc",
            }
            : { createdAt: "desc" };
        const profiles = await this.profileRepo.list(skip, limit, whereClause, sortCriteria);
        const total = await this.profileRepo.countAll(whereClause);
        return {
            profiles,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        };
    }
    async exec() {
        const state = await this.profileRepo.getStats();
        const category = await this.profileRepo.getProfileByCategoryStats();
        return { overview: state, byCategory: category };
    }
}
//# sourceMappingURL=profile.service.js.map