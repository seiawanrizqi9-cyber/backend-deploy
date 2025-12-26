import { body, param } from "express-validator";

export const createCategoryValidation = [
  body("name").trim().notEmpty().withMessage("Nama kategori wajib diisi"),
];

export const getCategoryByIdValidation = [
  param("id").isNumeric().withMessage("ID harus angka"),
];