import request from "supertest";
import app from "../app.js";
import jwt from "jsonwebtoken";
import config from "../utils/env.js";
import path from "path";
describe("GET /api/orders", () => {
    const token = jwt.sign({ id: 1, role: "USER" }, config.JWT_SECRET);
    it("should return 200 and list of order", async () => {
        const res = await request(app)
            .get("/api/orders")
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
    });
    it("should return 401 if no token provided", async () => {
        const res = await request(app).get("/api/orders");
        expect(res.statusCode).toEqual(401);
        expect(res.body.success).toBe(false);
    });
});
describe("POST /api/orders", () => {
    const token = jwt.sign({ id: 1, role: "USER" }, config.JWT_SECRET);
    it("should return 201 and order that has been created", async () => {
        const res = await request(app)
            .post("/api/orders")
            .send({ user_id: 1, total: 10000 })
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toEqual(201);
        expect(res.body.success).toBe(true);
    });
    it("should return 401 if no token provided", async () => {
        const res = await request(app)
            .post("/api/orders")
            .send({ user_id: 1, total: 10000 });
        expect(res.statusCode).toEqual(401);
        expect(res.body.success).toBe(false);
    });
});
describe("POST /api/orders/checkout", () => {
    const token = jwt.sign({ id: 1, role: "USER" }, config.JWT_SECRET);
    let productId;
    beforeAll(async () => {
        // Create a product first for checkout test
        const adminToken = jwt.sign({ id: 1, role: "ADMIN" }, config.JWT_SECRET);
        const productRes = await request(app)
            .post("/api/products")
            .field("name", "Product for checkout")
            .field("description", "test")
            .field("price", "5000")
            .field("stock", "100")
            .field("categoryId", "1")
            .attach("image", path.resolve(__dirname, "../../hacker.jpg"))
            .set("Authorization", `Bearer ${adminToken}`);
        productId = productRes.body.data.id;
    });
    it("should return 201 and checkout successfully", async () => {
        const res = await request(app)
            .post("/api/orders/checkout")
            .send({
            orderItems: [
                {
                    product_id: productId,
                    quantity: 2
                }
            ]
        })
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toEqual(201);
        expect(res.body.success).toBe(true);
    });
    it("should return 401 if no token provided", async () => {
        const res = await request(app)
            .post("/api/orders/checkout")
            .send({
            orderItems: [
                {
                    product_id: productId,
                    quantity: 1
                }
            ]
        });
        expect(res.statusCode).toEqual(401);
        expect(res.body.success).toBe(false);
    });
});
describe("GET /api/orders/:id", () => {
    const token = jwt.sign({ id: 1, role: "USER" }, config.JWT_SECRET);
    it("should return 200 for existing order", async () => {
        // First create an order
        const createRes = await request(app)
            .post("/api/orders")
            .send({ user_id: 1, total: 15000 })
            .set("Authorization", `Bearer ${token}`);
        const orderId = createRes.body.data.id;
        const res = await request(app)
            .get(`/api/orders/${orderId}`)
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
    });
    it("should return 400 for invalid order ID", async () => {
        const res = await request(app)
            .get("/api/orders/abc")
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toEqual(400);
        expect(res.body.success).toBe(false);
    });
    it("should return 401 if no token provided", async () => {
        const res = await request(app).get("/api/orders/1");
        expect(res.statusCode).toEqual(401);
        expect(res.body.success).toBe(false);
    });
});
describe("PUT /api/orders/:id", () => {
    const token = jwt.sign({ id: 1, role: "USER" }, config.JWT_SECRET);
    it("should return 200 and update order", async () => {
        // Create order first
        const createRes = await request(app)
            .post("/api/orders")
            .send({ user_id: 1, total: 10000 })
            .set("Authorization", `Bearer ${token}`);
        const orderId = createRes.body.data.id;
        // Update order
        const res = await request(app)
            .put(`/api/orders/${orderId}`)
            .send({ total: 20000 })
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
    });
    it("should return 401 if no token provided", async () => {
        const res = await request(app)
            .put("/api/orders/1")
            .send({ total: 20000 });
        expect(res.statusCode).toEqual(401);
        expect(res.body.success).toBe(false);
    });
});
describe("DELETE /api/orders/:id", () => {
    const token = jwt.sign({ id: 1, role: "USER" }, config.JWT_SECRET);
    it("should return 200 and delete order", async () => {
        // Create order first
        const createRes = await request(app)
            .post("/api/orders")
            .send({ user_id: 1, total: 10000 })
            .set("Authorization", `Bearer ${token}`);
        const orderId = createRes.body.data.id;
        // Delete order
        const res = await request(app)
            .delete(`/api/orders/${orderId}`)
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
    });
    it("should return 401 if no token provided", async () => {
        const res = await request(app).delete("/api/orders/1");
        expect(res.statusCode).toEqual(401);
        expect(res.body.success).toBe(false);
    });
});
describe("GET /api/orders/stats", () => {
    const token = jwt.sign({ id: 1, role: "USER" }, config.JWT_SECRET);
    it("should return 200 and order stats", async () => {
        const res = await request(app)
            .get("/api/orders/stats")
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
    });
    it("should return 401 if no token provided", async () => {
        const res = await request(app).get("/api/orders/stats");
        expect(res.statusCode).toEqual(401);
        expect(res.body.success).toBe(false);
    });
});
//# sourceMappingURL=order.test.js.map
