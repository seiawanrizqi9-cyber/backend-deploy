import type { Prisma, Profile, PrismaClient } from "../generated/client";
import type { IProfileRepository } from "../repository/profile.repository";

export interface CreateProfileData {
  user_id: number;
  name: string;
  gender?: string | null;
  address?: string | null;
  profile_picture_url?: string | null;
}

export interface UpdateProfileData {
  name?: string;
  gender?: string | null;
  address?: string | null;
  profile_picture_url?: string | null;
}

interface ProfilesParams {
  page: number;
  limit: number;
  search?: {
    name?: string;
    gender?: string;
    address?: string;
  };
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface ProfileListResponse {
  profiles: Profile[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface IProfileService {
  list(params: ProfilesParams): Promise<ProfileListResponse>;
  getByUserId(userId: number): Promise<Profile>;
  getById(profileId: number): Promise<Profile>;
  create(data: CreateProfileData): Promise<Profile>;
  update(profileId: number, data: UpdateProfileData): Promise<Profile>;
  delete(profileId: number): Promise<Profile>;
  exec(): Promise<{ overview: any; byCategory: any }>;
}

export class ProfileService implements IProfileService {
  constructor(
    private profileRepo: IProfileRepository,
    private prisma: PrismaClient
  ) {}

  async create(data: CreateProfileData): Promise<Profile> {
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

    const createData: Prisma.ProfileCreateInput = {
      user: { connect: { id: data.user_id } },
      name: data.name,
      gender: data.gender ? data.gender.toUpperCase() : null,
      address: data.address || null,
      profile_picture_url: data.profile_picture_url || null,
    };

    return await this.profileRepo.create(createData);
  }

  async getByUserId(userId: number): Promise<Profile> {
    const profile = await this.profileRepo.findByUserId(userId);
    if (!profile) {
      throw new Error("Profile tidak ditemukan");
    }
    return profile;
  }

  async getById(profileId: number): Promise<Profile> {
    const profile = await this.profileRepo.findById(profileId);
    if (!profile) {
      throw new Error("Profile tidak ditemukan");
    }
    return profile;
  }

  async update(profileId: number, data: UpdateProfileData): Promise<Profile> {
    const profile = await this.profileRepo.findById(profileId);
    if (!profile) {
      throw new Error("Profile tidak ditemukan");
    }

    const updateData: Prisma.ProfileUpdateInput = {
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

  async delete(profileId: number): Promise<Profile> {
    const profile = await this.profileRepo.findById(profileId);
    if (!profile) {
      throw new Error("Profile tidak ditemukan");
    }
    return await this.profileRepo.softDelete(profileId);
  }

  async list(params: ProfilesParams): Promise<ProfileListResponse> {
    const { page, limit, search, sortBy, sortOrder } = params;
    const skip = (page - 1) * limit;

    const whereClause: Prisma.ProfileWhereInput = {
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

    const sortCriteria: Prisma.ProfileOrderByWithRelationInput = sortBy
      ? {
          [sortBy]: sortOrder || "desc",
        }
      : { createdAt: "desc" };

    const profiles = await this.profileRepo.list(
      skip,
      limit,
      whereClause,
      sortCriteria
    );

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