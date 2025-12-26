import { body, param } from "express-validator";
export const createOrderValidation = [
    body("user_id")
        .isNumeric().withMessage("User ID harus angka")
        .toInt()
        .custom(value => value > 0).withMessage("User ID harus lebih dari 0"),
    body("total")
        .optional()
        .isNumeric().withMessage("Total harus angka").toFloat()
        .custom(value => value >= 0).withMessage("Total tidak boleh negatif"),
];
export const getOrderByIdValidation = [
    param("id")
        .isNumeric().withMessage("ID harus angka")
];
export const updateOrderValidation = [
    param("id")
        .isNumeric().withMessage("ID harus angka"),
    body("userId")
        .optional()
        .isNumeric().withMessage("User ID harus angka")
        .toInt()
        .custom(value => value > 0).withMessage("User ID harus lebih dari 0"),
    body("total")
        .optional()
        .isNumeric().withMessage("Total harus angka").toFloat()
        .custom(value => value >= 0).withMessage("Total tidak boleh negatif"),
];
export const checkoutValidation = [
    body("orderItems")
        .isArray({ min: 1 }).withMessage("Order items harus berupa array minimal 1 item"),
    body("orderItems.*.product_id")
        .isNumeric().withMessage("Product ID harus angka")
        .toInt()
        .custom(value => value > 0).withMessage("Product ID harus lebih dari 0"),
    body("orderItems.*.quantity")
        .isNumeric().withMessage("Quantity harus angka")
        .toInt()
        .custom(value => value > 0).withMessage("Quantity harus lebih dari 0"),
];
//# sourceMappingURL=order.validation.js.map