import express, {
  type Application,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import { errorHandler } from "./middleware/error.handler";
import { successResponse } from "./utils/response";
import productRouter from "./routes/product.route";
import categoryRouter from "./routes/category.route";
import orderRouter from "./routes/order.route";
import orderItemRouter from "./routes/orderItems.route";
import authRouter from "./routes/auth.route";
import { authenticate } from "./middleware/auth.validation";
import profileRouter from "./routes/profile.route";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./utils/swagger";


const app: Application = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.set("query parser", "extended");
app.use(express.static("public"));

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (_req: Request, res: Response) => {
  successResponse(res, "Selamat Datang Di API E-Commerce!", {
    hari: 5,
    status: "Server hidup!",

    // 🔐 AUTHENTICATION ENDPOINTS
    authentication: [
      {
        method: "POST",
        path: "/api/auth/password/register",
        description: "Register akun baru dengan password",
        body: {
          name: "string (required)",
          email: "string (required, unique)",
          password: "string (required)",
          role: "string (optional, default: 'USER')",
        },
        auth_required: false,
      },
      {
        method: "POST",
        path: "/api/auth/password/login",
        description: "Login dengan email & password",
        body: {
          email: "string (required)",
          password: "string (required)",
        },
        returns: "JWT token untuk akses protected endpoints",
        auth_required: false,
      },
      {
        method: "POST",
        path: "/api/auth/magic/request",
        description: "Request magic link login (tanpa password)",
        body: {
          email: "string (required)",
          name: "string (optional)",
        },
        note: "Token akan muncul di console server",
        auth_required: false,
      },
      {
        method: "POST",
        path: "/api/auth/magic/verify",
        description: "Verify magic token & dapatkan JWT",
        body: {
          token: "string (required, dari console)",
        },
        returns: "JWT token untuk akses protected endpoints",
        auth_required: false,
      },
      {
        method: "GET",
        path: "/api/auth/magic/validate",
        description: "Validate JWT token",
        headers: "Authorization: Bearer <your_jwt_token>",
        auth_required: true,
      },
      {
        method: "GET",
        path: "/api/auth/magic/user/:email",
        description: "Get user profile by email",
        auth_required: true,
      },
    ],

    // 🛍️ PRODUCT ENDPOINTS
    products: [
      {
        method: "GET",
        path: "/api/products",
        description: "Menampilkan semua produk",
        query_params: "?page=1&limit=10 (optional)",
        auth_required: false,
      },
      {
        method: "GET",
        path: "/api/products/:id",
        description: "Menampilkan produk berdasarkan ID",
        auth_required: false,
      },
      {
        method: "GET",
        path: "/api/products/search",
        description: "Mencari produk berdasarkan kata kunci",
        query_params: "?q=keyword&category=id",
        auth_required: false,
      },
      {
        method: "POST",
        path: "/api/products",
        description: "Menambahkan produk baru (Admin only)",
        body: {
          name: "string",
          description: "string",
          price: "number",
          stock: "number",
          categoryId: "number",
        },
        auth_required: true,
        role_required: "ADMIN",
      },
      {
        method: "PUT",
        path: "/api/products/:id",
        description: "Mengubah produk berdasarkan ID (Admin only)",
        auth_required: true,
        role_required: "ADMIN",
      },
      {
        method: "DELETE",
        path: "/api/products/:id",
        description: "Menghapus produk (soft delete, Admin only)",
        auth_required: true,
        role_required: "ADMIN",
      },
    ],

    // 📦 CATEGORY ENDPOINTS
    categories: [
      {
        method: "GET",
        path: "/api/categories",
        description: "Menampilkan semua kategori",
        auth_required: false,
      },
      {
        method: "GET",
        path: "/api/categories/:id",
        description: "Menampilkan kategori berdasarkan ID",
        auth_required: false,
      },
      {
        method: "POST",
        path: "/api/categories",
        description: "Menambahkan kategori baru (Admin only)",
        auth_required: true,
        role_required: "ADMIN",
      },
      {
        method: "PUT",
        path: "/api/categories/:id",
        description: "Mengubah kategori berdasarkan ID (Admin only)",
        auth_required: true,
        role_required: "ADMIN",
      },
      {
        method: "DELETE",
        path: "/api/categories/:id",
        description: "Menghapus kategori (Admin only)",
        auth_required: true,
        role_required: "ADMIN",
      },
    ],

    // 🛒 ORDER ENDPOINTS (SEMUA BUTUH AUTH)
    orders: [
      {
        method: "GET",
        path: "/api/orders",
        description:
          "Menampilkan semua order (Admin: semua, User: milik sendiri)",
        auth_required: true,
      },
      {
        method: "GET",
        path: "/api/orders/:id",
        description: "Menampilkan order berdasarkan ID",
        auth_required: true,
      },
      {
        method: "POST",
        path: "/api/orders",
        description: "Membuat order sederhana",
        body: {
          total: "number (optional)",
        },
        auth_required: true,
      },
      {
        method: "POST",
        path: "/api/orders/checkout",
        description: "Checkout dengan produk (auto calculate total)",
        body: {
          orderItems: [
            {
              product_id: "number (required)",
              quantity: "number (required, min: 1)",
            },
          ],
        },
        note: "User ID diambil otomatis dari JWT token",
        auth_required: true,
      },
      {
        method: "PUT",
        path: "/api/orders/:id",
        description: "Mengubah order (Admin only atau pemilik order)",
        auth_required: true,
      },
      {
        method: "DELETE",
        path: "/api/orders/:id",
        description: "Menghapus order (soft delete)",
        auth_required: true,
      },
    ],

    // 📝 ORDER ITEM ENDPOINTS
    order_items: [
      {
        method: "GET",
        path: "/api/order-items",
        description: "Menampilkan semua order item (Admin only)",
        auth_required: true,
        role_required: "ADMIN",
      },
      {
        method: "GET",
        path: "/api/order-items/:id",
        description: "Menampilkan order item berdasarkan ID",
        auth_required: true,
      },
      {
        method: "POST",
        path: "/api/order-items",
        description: "Membuat order item baru",
        auth_required: true,
      },
      {
        method: "PUT",
        path: "/api/order-items/:id",
        description: "Mengubah order item",
        auth_required: true,
      },
      {
        method: "DELETE",
        path: "/api/order-items/:id",
        description: "Menghapus order item",
        auth_required: true,
      },
    ],
  });
});

app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`Request masuk: ${req.method} ${req.path}`);
  req.startTime = Date.now();
  next();
});

app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/orders", authenticate, orderRouter);
app.use("/api/order-items", orderItemRouter);
app.use("/api/auth", authRouter);
app.use("/api/profiles", profileRouter);

app.get(/.*/, (req: Request, _res: Response) => {
  throw new Error(`Route ${req.originalUrl} tidak ada di API E-Commerce`);
});

app.use(errorHandler);

export default app;
