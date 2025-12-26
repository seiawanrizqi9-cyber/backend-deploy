import { Router } from "express";
import { getAll, getById, search, create, update, remove } from "../controllers/product.controller";
import { createProductValidation, getProductByIdValidation } from "../middleware/product.validation";
import { validate } from "../utils/validation";
const router = Router();
router.get('/', getAll);
router.get('/:id', validate(getProductByIdValidation), getById);
router.get('/search', search);
router.post('/', validate(createProductValidation), create);
router.put('/:id', update);
router.delete('/:id', remove);
export default router;
//# sourceMappingURL=product.route.js.map