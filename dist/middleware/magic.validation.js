import { body, validationResult } from "express-validator";
import { errorResponse } from "../utils/response.js";
export const validate = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }
        const errorList = errors.array().map(err => ({
            field: err.type === "field" ? err.path : "unknown",
            message: err.msg
        }));
        return errorResponse(res, "Validasi gagal", 400, errorList);
    };
};
export const requestMagicLinkValidation = [
    body("email")
        .trim()
        .notEmpty().withMessage("Email wajib diisi")
        .isEmail().withMessage("Format email tidak valid")
        .normalizeEmail(),
    body("name")
        .optional()
        .trim()
        .isLength({ min: 2 }).withMessage("Nama minimal 2 karakter")
        .isLength({ max: 50 }).withMessage("Nama maksimal 50 karakter")
];
export const verifyTokenValidation = [
    body("token")
        .trim()
        .notEmpty().withMessage("Token wajib diisi")
        .isLength({ min: 10, max: 64 }).withMessage("Token harus 10-64 karakter") // CHANGED
];
//# sourceMappingURL=magic.validation.js.map
