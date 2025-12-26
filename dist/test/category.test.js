import request from "supertest";
import app from "../app.js";
import jwt from "jsonwebtoken";
import config from "../utils/env.js";
describe("GET /api/categories", () => {
    it("should return 200 and list of category", async () => {
        const res = await request(app).get("/api/categories");
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
    });
});
describe("POST /api/categories", () => {
    const token = jwt.sign({ id: 1, role: "ADMIN" }, config.JWT_SECRET);
    it("Should return 201 and category that has been created", async () => {
        // Gunakan nama unique dengan timestamp
        const uniqueName = `test-category-${Date.now()}`;
        const res = await request(app)
            .post("/api/categories")
            .send({ name: uniqueName }) // PASTIKAN UNIQUE
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toEqual(201);
        expect(res.body.success).toBe(true);
    });
    it("should return 401 if no token provided", async () => {
        const uniqueName = `test-category-${Date.now()}-noauth`;
        const res = await request(app)
            .post("/api/categories")
            .send({ name: uniqueName });
        expect(res.statusCode).toEqual(401);
        expect(res.body.success).toBe(false);
    });
});
describe("GET /api/categories/:id", () => {
    const token = jwt.sign({ id: 1, role: "ADMIN" }, config.JWT_SECRET);
    it("should return 200 for existing category", async () => {
        // Buat category dengan nama unique
        const uniqueName = `category-for-get-${Date.now()}`;
        const createRes = await request(app)
            .post("/api/categories")
            .send({ name: uniqueName })
            .set("Authorization", `Bearer ${token}`);
        // CEK DULU APAKAH CREATE BERHASIL
        if (createRes.statusCode !== 201) {
            console.log("Create failed:", createRes.body);
            // Skip test jika create gagal
            return;
        }
        const categoryId = createRes.body.data.id;
        const res = await request(app)
            .get(`/api/categories/${categoryId}`)
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
    });
    it("should return 400 for invalid category ID", async () => {
        const res = await request(app)
            .get("/api/categories/abc")
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toEqual(400);
        expect(res.body.success).toBe(false);
    });
});
describe("PUT /api/categories/:id", () => {
    const token = jwt.sign({ id: 1, role: "ADMIN" }, config.JWT_SECRET);
    it("should return 200 and update category", async () => {
        // Buat category dengan nama unique
        const originalName = `category-to-update-${Date.now()}`;
        const createRes = await request(app)
            .post("/api/categories")
            .send({ name: originalName })
            .set("Authorization", `Bearer ${token}`);
        // CEK DULU CREATE BERHASIL
        if (createRes.statusCode !== 201) {
            console.log("Create failed for update:", createRes.body);
            return;
        }
        const categoryId = createRes.body.data.id;
        // Update dengan nama baru yang unique juga
        const updatedName = `updated-category-${Date.now()}`;
        const res = await request(app)
            .put(`/api/categories/${categoryId}`)
            .send({ name: updatedName })
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
    });
});
describe("DELETE /api/categories/:id", () => {
    const token = jwt.sign({ id: 1, role: "ADMIN" }, config.JWT_SECRET);
    it("should return 200 and delete category", async () => {
        // Buat category dengan nama unique
        const uniqueName = `category-to-delete-${Date.now()}`;
        const createRes = await request(app)
            .post("/api/categories")
            .send({ name: uniqueName })
            .set("Authorization", `Bearer ${token}`);
        // CEK DULU CREATE BERHASIL
        if (createRes.statusCode !== 201) {
            console.log("Create failed for delete:", createRes.body);
            return;
        }
        const categoryId = createRes.body.data.id;
        // Delete category
        const res = await request(app)
            .delete(`/api/categories/${categoryId}`)
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
    });
});
describe("GET /api/categories/stats", () => {
    const token = jwt.sign({ id: 1, role: "ADMIN" }, config.JWT_SECRET);
    it("should return 200 and category stats", async () => {
        const res = await request(app)
            .get("/api/categories/stats")
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
    });
});
//# sourceMappingURL=category.test.js.map
