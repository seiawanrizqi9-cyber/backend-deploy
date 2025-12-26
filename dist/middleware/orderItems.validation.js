import { body, param } from "express-validator";
export const createOrderItemValidation = [
    body("orderId")
        .isNumeric().withMessage("Order ID harus angka")
        .toInt()
        .custom(value => value > 0).withMessage("Order ID harus lebih dari 0"),
    body("productId")
        .isNumeric().withMessage("Product ID harus angka")
        .toInt()
        .custom(value => value > 0).withMessage("Product ID harus lebih dari 0"),
    body("quantity")
        .isNumeric().withMessage("Quantity harus angka")
        .toInt()
        .custom(value => value > 0).withMessage("Quantity harus lebih dari 0"),
];
export const getOrderItemByIdValidation = [
    param("id")
        .isNumeric().withMessage("ID harus angka")
];
export const updateOrderItemValidation = [
    param("id")
        .isNumeric().withMessage("ID harus angka"),
    body("order_id")
        .optional()
        .isNumeric().withMessage("Order ID harus angka")
        .toInt()
        .custom(value => value > 0).withMessage("Order ID harus lebih dari 0"),
    body("product_id")
        .optional()
        .isNumeric().withMessage("Product ID harus angka")
        .toInt()
        .custom(value => value > 0).withMessage("Product ID harus lebih dari 0"),
    body("quantity")
        .optional()
        .isNumeric().withMessage("Quantity harus angka")
        .toInt()
        .custom(value => value > 0).withMessage("Quantity harus lebih dari 0"),
];
//# sourceMappingURL=orderItems.validation.js.map