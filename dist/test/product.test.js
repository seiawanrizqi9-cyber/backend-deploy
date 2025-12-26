import request from "supertest";
import app from "../app.js";
import jwt from "jsonwebtoken";
import config from "../utils/env.js";
import path from "path";
describe("get/api/products", () => {
    it("should return 200 and list of product", async () => {
        const res = await request(app).get("/api/products");
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
    });
});
describe("POST /api/products", () => {
    const token = jwt.sign({ id: 1, role: "ADMIN" }, config.JWT_SECRET);
    // it("should return 401 if no token provided", async () => {
    //   const res = await request(app)
    //     .post("/api/products")
    //     .field("name", "test")
    //     .field("description", "test")
    //     .field("price", "1")
    //     .field("stock", "1")
    //     .field("categoryId", "1")
    //     .attach("image", path.resolve(__dirname, "../../hacker.jpg"));
    //   expect(res.statusCode).toEqual(401);
    //   expect(res.body.success).toBe(false);
    // });
    it("Should return 201 and product that has been created", async () => {
        const res = await request(app)
            .post("/api/products")
            .set("Authorization", `Bearer ${token}`)
            .field("name", "test")
            .field("description", "test")
            .field("price", "1")
            .field("stock", "1")
            .field("categoryId", "1")
            .attach("image", path.resolve(__dirname, "../../hacker.jpg"));
        expect(res.statusCode).toEqual(201);
        expect(res.body.success).toBe(true);
    });
});
describe("GET /api/products/:id", () => {
    it("should return 200 for existing product", async () => {
        const token = jwt.sign({ id: 1, role: "ADMIN" }, config.JWT_SECRET);
        const createRes = await request(app)
            .post("/api/products")
            .field("name", "product for get test")
            .field("description", "test")
            .field("price", "1")
            .field("stock", "1")
            .field("categoryId", "1")
            .attach("image", path.resolve(__dirname, "../../hacker.jpg"))
            .set("Authorization", `Bearer ${token}`);
        const productId = createRes.body.data.id;
        const res = await request(app).get(`/api/products/${productId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
    });
    it("should return 400 for invalid product ID", async () => {
        const res = await request(app).get("/api/products/abc");
        expect(res.statusCode).toEqual(400);
        expect(res.body.success).toBe(false);
    });
});
describe("PUT /api/products/:id", () => {
    const token = jwt.sign({ id: 1, role: "ADMIN" }, config.JWT_SECRET);
    it("should return 200 and update product", async () => {
        // First create a product
        const createRes = await request(app)
            .post("/api/products")
            .field("name", "product to update")
            .field("description", "test")
            .field("price", "10000")
            .field("stock", "10")
            .field("categoryId", "1")
            .attach("image", path.resolve(__dirname, "../../hacker.jpg"))
            .set("Authorization", `Bearer ${token}`);
        const productId = createRes.body.data.id;
        // Update product - PAKAI .send() untuk JSON
        const res = await request(app)
            .put(`/api/products/${productId}`)
            .send({
            name: "updated product",
            description: "updated",
            price: 20000,
            stock: 20,
            categoryId: 2,
        })
            .set("Authorization", `Bearer ${token}`)
            .set("Content-Type", "application/json");
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
    });
});
describe("DELETE /api/products/:id", () => {
    const token = jwt.sign({ id: 1, role: "ADMIN" }, config.JWT_SECRET);
    it("should return 200 and delete product", async () => {
        // First create a product
        const createRes = await request(app)
            .post("/api/products")
            .field("name", "product to delete")
            .field("description", "test")
            .field("price", "5000")
            .field("stock", "5")
            .field("categoryId", "1")
            .attach("image", path.resolve(__dirname, "../../hacker.jpg"))
            .set("Authorization", `Bearer ${token}`);
        const productId = createRes.body.data.id;
        // Delete product
        const res = await request(app)
            .delete(`/api/products/${productId}`)
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
    });
});
describe("GET /api/products/stats", () => {
    const token = jwt.sign({ id: 1, role: "ADMIN" }, config.JWT_SECRET);
    it("should return 200 and product stats", async () => {
        const res = await request(app)
            .get("/api/products/stats")
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
    });
});
//# sourceMappingURL=product.test.js.map
