// order-item.routes.ts  
import { Router } from "express";
import * as orderItemController from "../controllers/orderItems.controller";
import { createOrderItemValidation, getOrderItemByIdValidation, updateOrderItemValidation, } from "../middleware/orderItems.validation";
import { validate } from "../utils/validation";
const router = Router();
router.get("/", orderItemController.getAll);
router.get("/:id", validate(getOrderItemByIdValidation), orderItemController.getById);
router.post("/", validate(createOrderItemValidation), orderItemController.create);
router.put("/:id", validate(updateOrderItemValidation), orderItemController.update);
router.delete("/:id", validate(getOrderItemByIdValidation), orderItemController.remove);
export default router;
//# sourceMappingURL=orderItems.route.js.map