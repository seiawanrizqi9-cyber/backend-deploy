import { body, param } from "express-validator";
export const createProductValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Nama produk wajib diisi")
        .isLength({ min: 3 })
        .withMessage("Nama produk minimal 3 karakter"),
    body("description").trim().notEmpty().withMessage("Deskripsi wajib diisi"),
    body("price")
        .isNumeric()
        .withMessage("Harga harus angka")
        .toFloat()
        .custom((value) => value > 0)
        .withMessage("Harga harus lebih dari 0"),
    body("stock")
        .isNumeric()
        .withMessage("Stock harus angka")
        .custom((value) => value > 0)
        .withMessage("Stock harus lebih dari 0"),
    body("categoryId")
        .isNumeric()
        .withMessage("ID kategori harus angka")
        .custom((value) => value > 0)
        .withMessage("ID kategori harus lebih dari 0"),
];
export const getProductByIdValidation = [
    param("id").isNumeric().withMessage("ID harus angka"),
];
//# sourceMappingURL=product.validation.js.map