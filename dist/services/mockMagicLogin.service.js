import crypto from 'crypto';
import jwt from 'jsonwebtoken';
// Mock in-memory storage
const mockUsers = [];
const mockTokens = [];
export class MockMagicLoginService {
    generateToken() {
        return crypto.randomBytes(5).toString('hex');
    }
    async requestMagicLink(email, name) {
        try {
            const cleanEmail = email.toLowerCase().trim();
            // Find or create user
            let user = mockUsers.find(u => u.email === cleanEmail);
            if (!user) {
                user = {
                    id: `user_${Date.now()}`,
                    email: cleanEmail,
                    name,
                    isVerified: false,
                    loginCount: 0,
                    createdAt: new Date()
                };
                mockUsers.push(user);
            }
            // Create token
            const token = this.generateToken();
            const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
            mockTokens.push({
                email: cleanEmail,
                token,
                expiresAt,
                used: false,
                createdAt: new Date()
            });
            // Log token for testing
            console.log('🔗 TEST MAGIC LINK (NO DB):', {
                email: cleanEmail,
                token: token,
                magicLink: `http://localhost:5000/api/auth/verify?token=${token}`,
                expiresAt: expiresAt
            });
            return true;
        }
        catch (error) {
            console.error('❌ Mock magic link failed:', error);
            return false;
        }
    }
    async verifyMagicToken(token) {
        try {
            // Find token
            const mockToken = mockTokens.find(t => t.token === token &&
                !t.used &&
                new Date(t.expiresAt) > new Date());
            if (!mockToken) {
                return { success: false };
            }
            // Mark as used
            mockToken.used = true;
            // Find or create user
            let user = mockUsers.find(u => u.email === mockToken.email);
            if (!user) {
                user = {
                    id: `user_${Date.now()}`,
                    email: mockToken.email,
                    isVerified: true,
                    loginCount: 1,
                    lastLogin: new Date(),
                    createdAt: new Date()
                };
                mockUsers.push(user);
            }
            else {
                user.isVerified = true;
                user.loginCount += 1;
                user.lastLogin = new Date();
            }
            // Generate JWT
            const authToken = jwt.sign({
                userId: user.id,
                email: user.email
            }, process.env.JWT_SECRET || 'test_secret', { expiresIn: '7d' });
            return {
                success: true,
                user,
                authToken
            };
        }
        catch (error) {
            console.error('❌ Mock token verification failed:', error);
            return { success: false };
        }
    }
    async validateAuthToken(authToken) {
        try {
            const decoded = jwt.verify(authToken, process.env.JWT_SECRET || 'test_secret');
            return decoded;
        }
        catch (error) {
            return null;
        }
    }
    async getUserByEmail(email) {
        return mockUsers.find(u => u.email === email.toLowerCase().trim());
    }
}
//# sourceMappingURL=mockMagicLogin.service.js.map