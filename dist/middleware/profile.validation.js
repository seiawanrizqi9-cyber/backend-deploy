import { body, param } from "express-validator";
export const createProfileValidation = [
    body("name")
        .notEmpty().withMessage("Nama wajib diisi")
        .isLength({ min: 2, max: 100 }).withMessage("Nama harus 2-100 karakter"),
    body("gender")
        .optional()
        .isIn(['MALE', 'FEMALE', 'OTHER']).withMessage("Gender harus MALE, FEMALE, atau OTHER"),
    body("address")
        .optional()
        .isLength({ max: 255 }).withMessage("Address maksimal 255 karakter"),
    body("profile_picture_url")
        .optional()
        .isURL().withMessage("Profile picture harus URL valid"),
    body("user_id")
        .optional() // Optional karena bisa dari token
        .isInt({ min: 1 }).withMessage("User ID harus angka positif")
];
export const updateProfileValidation = [
    param("id")
        .isInt({ min: 1 }).withMessage("ID profile harus angka positif"),
    body("name")
        .optional()
        .isLength({ min: 2, max: 100 }).withMessage("Nama harus 2-100 karakter"),
    body("gender")
        .optional()
        .isIn(['MALE', 'FEMALE']).withMessage("Gender harus MALE atau FEMALE")
        .toUpperCase(),
    body("address")
        .optional()
        .isLength({ max: 255 }).withMessage("Address maksimal 255 karakter"),
    body("profile_picture_url")
        .optional()
        .isURL().withMessage("Profile picture harus URL valid")
];
export const getProfileValidation = [
    param("id")
        .isInt({ min: 1 }).withMessage("ID profile harus angka positif")
];
export const getUserProfileValidation = [
    param("userId")
        .isInt({ min: 1 }).withMessage("User ID harus angka positif")
];
//# sourceMappingURL=profile.validation.js.map