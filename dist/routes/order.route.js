import { Router } from "express";
import * as orderController from "../controllers/order.controller";
import { createOrderValidation, getOrderByIdValidation, updateOrderValidation, } from "../middleware/order.validation";
import { validate } from "../utils/validation";
const router = Router();
router.get("/", orderController.getAll);
router.get("/:id", validate(getOrderByIdValidation), orderController.getById);
router.post("/", validate(createOrderValidation), orderController.create);
router.post("/checkout", orderController.checkout);
router.put("/:id", validate(updateOrderValidation), orderController.update);
router.delete("/:id", validate(getOrderByIdValidation), orderController.remove);
export default router;
//# sourceMappingURL=order.route.js.map