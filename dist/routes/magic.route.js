import { Router } from "express";
import { requestMagicLink, verifyMagicToken, validateSession, getUserProfile, } from "../controllers/magicLogin.controller";
import { requestMagicLinkValidation, verifyTokenValidation, validate, } from "../middleware/magic.validation";
const router = Router();
// Public routes
router.post("/request", validate(requestMagicLinkValidation), requestMagicLink);
router.post("/verify", validate(verifyTokenValidation), verifyMagicToken);
// Protected routes (need token)
router.get("/validate", validateSession);
router.get("/user/:email", getUserProfile);
export default router;
//# sourceMappingURL=magic.route.js.map