import { successResponse, errorResponse } from "../utils/response.js";
// import { MagicLoginService } from "../services/magicLogin.service";
import { MockMagicLoginService } from "../services/mockMagicLogin.service.js";
// const magicService = new MagicLoginService();
const magicService = new MockMagicLoginService();
export const requestMagicLink = async (req, res) => {
    try {
        const { email, name } = req.body;
        if (!email || !email.includes("@")) {
            return errorResponse(res, "Email tidak valid", 400);
        }
        const sent = await magicService.requestMagicLink(email, name);
        if (sent) {
            successResponse(res, "Magic link telah dikirim ke email Anda!", { email });
        }
        else {
            errorResponse(res, "Gagal mengirim magic link", 500);
        }
    }
    catch (error) {
        console.error("Error:", error.message);
        errorResponse(res, "Terjadi kesalahan server", 500);
    }
};
export const verifyMagicToken = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return errorResponse(res, "Token diperlukan", 400);
        }
        const result = await magicService.verifyMagicToken(token);
        if (result.success) {
            successResponse(res, "Login berhasil!", {
                user: result.user,
                token: result.authToken,
                expiresIn: "7 hari",
            });
        }
        else {
            errorResponse(res, "Magic link tidak valid atau telah kedaluwarsa", 400);
        }
    }
    catch (error) {
        console.error("Error:", error.message);
        errorResponse(res, "Terjadi kesalahan server", 500);
    }
};
export const validateSession = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return errorResponse(res, "Token tidak tersedia", 401);
        }
        const decoded = await magicService.validateAuthToken(token);
        if (decoded) {
            successResponse(res, "Session valid", { user: decoded, valid: true });
        }
        else {
            errorResponse(res, "Token tidak valid", 401);
        }
    }
    catch (error) {
        console.error("Error:", error.message);
        errorResponse(res, "Terjadi kesalahan server", 500);
    }
};
export const getUserProfile = async (req, res) => {
    try {
        const { email } = req.params;
        if (!email) {
            return errorResponse(res, "Email diperlukan", 400);
        }
        const user = await magicService.getUserByEmail(email);
        if (user) {
            successResponse(res, "Profil user ditemukan", user);
        }
        else {
            errorResponse(res, "User tidak ditemukan", 404);
        }
    }
    catch (error) {
        console.error("Error:", error.message);
        errorResponse(res, "Terjadi kesalahan server", 500);
    }
};
//# sourceMappingURL=magicLogin.controller.js.map
