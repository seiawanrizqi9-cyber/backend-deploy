import type { Prisma, Profile, PrismaClient } from "../generated/client.js";
import type { IProfileRepository } from "../repository/profile.repository.js";
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
    exec(): Promise<{
        overview: any;
        byCategory: any;
    }>;
}
export declare class ProfileService implements IProfileService {
    private profileRepo;
    private prisma;
    constructor(profileRepo: IProfileRepository, prisma: PrismaClient);
    create(data: CreateProfileData): Promise<Profile>;
    getByUserId(userId: number): Promise<Profile>;
    getById(profileId: number): Promise<Profile>;
    update(profileId: number, data: UpdateProfileData): Promise<Profile>;
    delete(profileId: number): Promise<Profile>;
    list(params: ProfilesParams): Promise<ProfileListResponse>;
    exec(): Promise<{
        overview: Prisma.GetProfileAggregateType<{
            _count: {
                id: true;
            };
        }>;
        byCategory: (Prisma.PickEnumerable<Prisma.ProfileGroupByOutputType, "id"[]> & {
            _count: {
                id: number;
            };
        })[];
    }>;
}
export {};
//# sourceMappingURL=profile.service.d.ts.map
