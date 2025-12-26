import express, {} from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import { errorHandler } from "./middleware/error.handler";
import { successResponse } from "./utils/response";
import productRouter from "./routes/product.route";
import magicRoute from "./routes/magic.route";
import categoryRouter from "./routes/category.route";
import orderRouter from "./routes/order.route";
import orderItemRouter from "./routes/orderItems.route";
const app = express();
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.get("/", (_req, res) => {
    successResponse(res, "Selamat Datang Di API E-Commerce!", {
        hari: 5,
        status: "Server hidup!",
        endpointsProduct: [
            {
                path: "/api/products",
                method: "GET",
                description: "Menampilkan semua produk",
            },
            {
                path: "/api/products/:id",
                method: "GET",
                description: "Menampilkan produk berdasarkan ID",
            },
            {
                path: "/api/products/search",
                method: "GET",
                description: "Mencari produk berdasarkan kata kunci",
            },
            {
                path: "/api/products",
                method: "POST",
                description: "Menambahkan produk baru",
            },
            {
                path: "/api/products/:id",
                method: "PUT",
                description: "Mengubah produk berdasarkan ID",
            },
            {
                path: "/api/products/:id",
                method: "DELETE",
                description: "Menghapus produk berdasarkan ID",
            },
        ],
        magicLogin: [
            {
                path: "/api/auth/request",
                method: "POST",
                description: "Request magic link login",
            },
            {
                path: "/api/auth/verify",
                method: "POST",
                description: "Verify magic token",
            },
            {
                path: "/api/auth/validate",
                method: "GET",
                description: "Validate session token",
            },
            {
                path: "/api/auth/user/:email",
                method: "GET",
                description: "Get user profile",
            },
        ],
        tryLogin: [
            {
                path: "/api/auth/request",
                method: "POST",
                Body: {
                    email: "test@example.com",
                    name: "Test User",
                },
                description: "Request magic link login",
            },
            {
                path: "/api/auth/verify",
                method: "POST",
                Body: {
                    "token": "put the token from terminal"
                },
                description: "Verify magic token and get JWT token",
            },
            {
                path: "/api/auth/validate",
                method: "GET",
                Headers: "Bearer PASTE_JWT_TOKEN_HERE",
                description: "Validate session token",
            },
        ],
        endpointsCategory: [
            {
                path: "/api/categories",
                method: "GET",
                description: "Menampilkan semua kategori",
            },
            {
                path: "/api/categories/:id",
                method: "GET",
                description: "Menampilkan kategori berdasarkan ID",
            },
            {
                path: "/api/categories",
                method: "POST",
                description: "Menambahkan kategori baru",
            },
            {
                path: "/api/categories/:id",
                method: "PUT",
                description: "Mengubah kategori berdasarkan ID",
            },
            {
                path: "/api/categories/:id",
                method: "DELETE",
                description: "Menghapus kategori",
            },
        ],
        endpointsOrder: [
            {
                path: "/api/orders",
                method: "GET",
                description: "Menampilkan semua order",
            },
            {
                path: "/api/orders/:id",
                method: "GET",
                description: "Menampilkan order berdasarkan ID",
            },
            {
                path: "/api/orders",
                method: "POST",
                description: "Membuat order baru",
            },
            {
                path: "/api/orders/:id",
                method: "PUT",
                description: "Mengubah order berdasarkan ID",
            },
            {
                path: "/api/orders/:id",
                method: "DELETE",
                description: "Menghapus order",
            },
        ],
        endpointsOrderItem: [
            {
                path: "/api/order-items",
                method: "GET",
                description: "Menampilkan semua order item",
            },
            {
                path: "/api/order-items/:id",
                method: "GET",
                description: "Menampilkan order item berdasarkan ID",
            },
            {
                path: "/api/order-items",
                method: "POST",
                description: "Membuat order item baru",
            },
            {
                path: "/api/order-items/:id",
                method: "PUT",
                description: "Mengubah order item berdasarkan ID",
            },
            {
                path: "/api/order-items/:id",
                method: "DELETE",
                description: "Menghapus order item",
            },
        ],
    });
});
app.use((req, _res, next) => {
    console.log(`Request masuk: ${req.method} ${req.path}`);
    req.startTime = Date.now();
    next();
});
app.use((req, res, next) => {
    const apiKey = req.headers["x-api-key"];
    if (!apiKey) {
        return res.status(401).json({
            success: false,
            message: "Header X-API-Key wajib diisi untuk akses API!",
        });
    }
    if (apiKey !== "katasandi123") {
        return res.status(401).json({
            success: false,
            message: "API Key tidak valid!",
        });
    }
    next();
});
app.use("/api/products", productRouter);
app.use("/api/auth", magicRoute);
app.use("/api/categories", categoryRouter);
app.use("/api/orders", orderRouter);
app.use("/api/order-items", orderItemRouter);
app.get(/.*/, (req, _res) => {
    throw new Error(`Route ${req.originalUrl} tidak ada di API E-Commerce`);
});
app.use(errorHandler);
export default app;
//# sourceMappingURL=app.js.map