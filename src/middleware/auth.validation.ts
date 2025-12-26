import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../utils/env";
import { errorResponse } from "../utils/response";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    const token = authHeader?.split(' ')[1];

    try {
        const payload = jwt.verify(token!, config.JWT_SECRET) as { id: number, role: string };

        req.user = payload;
        next();
    } catch (error) {
        errorResponse(res, "Unauthorized", 401);
    }
}