export interface IMagicUser {
    id?: string;
    email: string;
    name?: string;
    isVerified: boolean;
    lastLogin?: Date;
    loginCount: number;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface IMagicToken {
    id?: string;
    email: string;
    token: string;
    expiresAt: Date;
    used: boolean;
    createdAt?: Date;
}
//# sourceMappingURL=magicUser.type.d.ts.map