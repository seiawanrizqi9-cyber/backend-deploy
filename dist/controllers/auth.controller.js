import * as authService from "../services/auth.service.js";
import { successResponse } from "../utils/response.js";
export const login = async (req, res) => {
    const result = await authService.login(req.body);
    successResponse(res, "Login berhasil!", result, null, 200);
};
export const register = async (req, res) => {
    const result = await authService.register(req.body);
    successResponse(res, "Register berhasil!", result, null, 201);
};
//# sourceMappingURL=auth.controller.js.map
