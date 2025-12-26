import { errorResponse } from "../utils/response.js";
import config from "../utils/env.js";
import { Prisma } from "../generated/client.js";
export const errorHandler = (err, _req, res, _next) => {
    console.error("ERROR:", err.message);
    let statusCode = 500;
    let message = err.message || "Terjadi kesalahan server";
    let errors = null;
    // Handle Prisma Errors
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        statusCode = 400;
        if (err.code === "P2002") {
            message = "Data sudah ada (Unique constraint violation)";
            errors = [{ field: err.meta?.target?.join(", "), message: "Sudah terdaftar" }];
        }
        else if (err.code === "P2025") {
            statusCode = 404;
            message = "Data tidak ditemukan";
        }
    }
    // Handle Validation or Business Logic Errors
    else if (statusCode === 500) {
        if (message.includes("tidak ditemukan") || message.includes("not found")) {
            statusCode = 404;
        }
        else if (message.includes("salah") || message.includes("invalid") || message.includes("sudah terdaftar")) {
            statusCode = 400;
        }
    }
    // Only show stack trace for status 500 in Development
    const errorDetails = config.NODE_ENV === "development" && statusCode === 500
        ? { stack: err.stack }
        : errors;
    return errorResponse(res, message, statusCode, errorDetails);
};
//# sourceMappingURL=error.handler.js.map
