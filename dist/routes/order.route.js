import { Router } from "express";
import { createOrderValidation, getOrderByIdValidation, updateOrderValidation, checkoutValidation, } from "../middleware/order.validation.js";
import { OrderRepository } from "../repository/order.repository.js";
import { validate } from "../utils/validation.js";
import { OrderService } from "../services/order.service.js";
import { OrderController } from "../controllers/order.controller.js";
import { authenticate } from "../middleware/auth.validation.js";
import prismaInstance from "../database.js";
const router = Router();
// Dependency Injection
const repo = new OrderRepository(prismaInstance);
const service = new OrderService(repo, prismaInstance);
const controller = new OrderController(service);
/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Manajemen order/pesanan e-commerce
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID order
 *         user_id:
 *           type: integer
 *           description: ID user pembeli
 *         total:
 *           type: number
 *           format: float
 *           description: Total harga order
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *     OrderInput:
 *       type: object
 *       required:
 *         - user_id
 *       properties:
 *         user_id:
 *           type: integer
 *           example: 1
 *         total:
 *           type: number
 *           format: float
 *           example: 100000
 *     OrderUpdate:
 *       type: object
 *       properties:
 *         user_id:
 *           type: integer
 *         total:
 *           type: number
 *           format: float
 *     OrderItemInput:
 *       type: object
 *       required:
 *         - product_id
 *         - quantity
 *       properties:
 *         product_id:
 *           type: integer
 *           example: 1
 *         quantity:
 *           type: integer
 *           example: 2
 *     CheckoutRequest:
 *       type: object
 *       required:
 *         - orderItems
 *       properties:
 *         orderItems:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItemInput'
 *     OrderDetail:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         customer:
 *           type: string
 *         email:
 *           type: string
 *         total:
 *           type: number
 *         tanggal:
 *           type: string
 *           format: date-time
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               produk:
 *                 type: string
 *               harga_satuan:
 *                 type: number
 *               jumlah:
 *                 type: integer
 *     CheckoutResponse:
 *       type: object
 *       properties:
 *         order_id:
 *           type: integer
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             username:
 *               type: string
 *             email:
 *               type: string
 *         total:
 *           type: number
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: integer
 *               product_name:
 *                 type: string
 *               price:
 *                 type: number
 *               quantity:
 *                 type: integer
 *               subtotal:
 *                 type: number
 *         total_items:
 *           type: integer
 *         created_at:
 *           type: string
 *           format: date-time
 */
/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Mendapatkan daftar order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Nomor halaman
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Jumlah item per halaman
 *       - in: query
 *         name: min_total
 *         schema:
 *           type: number
 *         description: Filter total minimum
 *       - in: query
 *         name: max_total
 *         schema:
 *           type: number
 *         description: Filter total maksimum
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [total, createdAt]
 *         description: Kolom untuk sorting
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Urutan sorting
 *     responses:
 *       200:
 *         description: Daftar order berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       401:
 *         description: Tidak terautentikasi
 *     description: |
 *       Admin: Melihat semua order
 *       User: Hanya melihat order milik sendiri
 */
router.get("/", authenticate, controller.list);
/**
 * @swagger
 * /orders/stats:
 *   get:
 *     summary: Mendapatkan statistik order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistik order berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     overview:
 *                       type: object
 *                     byCategory:
 *                       type: object
 *       401:
 *         description: Tidak terautentikasi
 */
router.get("/stats", authenticate, controller.getStats);
/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Mendapatkan order berdasarkan ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID order
 *     responses:
 *       200:
 *         description: Order berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/OrderDetail'
 *       401:
 *         description: Tidak terautentikasi
 *       404:
 *         description: Order tidak ditemukan
 *     description: |
 *       Admin: Bisa melihat semua order
 *       User: Hanya bisa melihat order milik sendiri
 */
router.get("/:id", authenticate, validate(getOrderByIdValidation), controller.getById);
/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Membuat order sederhana
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderInput'
 *     responses:
 *       201:
 *         description: Order berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Data tidak valid
 *       401:
 *         description: Tidak terautentikasi
 */
router.post("/", authenticate, validate(createOrderValidation), controller.create);
/**
 * @swagger
 * /orders/checkout:
 *   post:
 *     summary: Checkout dengan produk (auto calculate total)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CheckoutRequest'
 *     responses:
 *       201:
 *         description: Checkout berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/CheckoutResponse'
 *       400:
 *         description: Data tidak valid atau stok tidak cukup
 *       401:
 *         description: Tidak terautentikasi
 *     description: |
 *       User ID diambil otomatis dari JWT token
 *       Stok produk akan otomatis berkurang
 */
router.post("/checkout", authenticate, validate(checkoutValidation), controller.checkout);
/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Mengupdate order (Admin only atau pemilik order)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderUpdate'
 *     responses:
 *       200:
 *         description: Order berhasil diupdate
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Data tidak valid
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Tidak memiliki akses
 *       404:
 *         description: Order tidak ditemukan
 */
router.put("/:id", authenticate, validate(updateOrderValidation), controller.update);
/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Menghapus order (soft delete)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID order
 *     responses:
 *       200:
 *         description: Order berhasil dihapus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Tidak memiliki akses
 *       404:
 *         description: Order tidak ditemukan
 *     description: |
 *       Admin: Bisa menghapus semua order
 *       User: Hanya bisa menghapus order milik sendiri
 */
router.delete("/:id", authenticate, validate(getOrderByIdValidation), controller.delete);
export default router;
//# sourceMappingURL=order.route.js.map
