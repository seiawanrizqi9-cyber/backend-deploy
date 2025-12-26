export declare class MockMagicLoginService {
    private generateToken;
    requestMagicLink(email: string, name?: string): Promise<boolean>;
    verifyMagicToken(token: string): Promise<{
        success: boolean;
        user?: any;
        authToken?: string;
    }>;
    validateAuthToken(authToken: string): Promise<any>;
    getUserByEmail(email: string): Promise<any>;
}
//# sourceMappingURL=mockMagicLogin.service.d.ts.map