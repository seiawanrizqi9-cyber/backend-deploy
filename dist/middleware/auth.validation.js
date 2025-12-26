import jwt from "jsonwebtoken";
import config from "../utils/env.js";
import { errorResponse } from "../utils/response.js";
export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    try {
        const payload = jwt.verify(token, config.JWT_SECRET);
        req.user = payload;
        next();
    }
    catch (error) {
        errorResponse(res, "Unauthorized", 401);
    }
};
//# sourceMappingURL=auth.validation.js.map
