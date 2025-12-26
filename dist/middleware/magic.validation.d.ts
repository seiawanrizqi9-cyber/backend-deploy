import type { NextFunction, Request, Response } from "express";
import { type ValidationChain } from "express-validator";
export declare const validate: (validations: ValidationChain[]) => (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const requestMagicLinkValidation: ValidationChain[];
export declare const verifyTokenValidation: ValidationChain[];
//# sourceMappingURL=magic.validation.d.ts.map