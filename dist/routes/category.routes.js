import { Router } from "express";
import * as category from "../controllers/category.controller";
const router = Router();
router.get("/", category.getAll);
router.get("/:id", category.categoryId);
router.post("/", category.create);
router.put("/:id", category.update);
router.delete("/:id", category.remove);
export default router;
//# sourceMappingURL=category.routes.js.map