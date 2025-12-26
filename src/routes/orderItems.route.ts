import { Router } from "express";
import {
  createOrderItemValidation,
  getOrderItemByIdValidation,
  updateOrderItemValidation,
} from "../middleware/orderItems.validation";
import { OrderItemRepository } from "../repository/orderItems.repository";
import { validate } from "../utils/validation";
import { OrderItemService } from "../services/orderItems.service";
import { OrderItemController } from "../controllers/orderItems.controller";
import { authenticate } from "../middleware/auth.validation";
import prismaInstance from "../prisma";

const router = Router();

// Dependency Injection
const repo = new OrderItemRepository(prismaInstance);
const service = new OrderItemService(repo);
const controller = new OrderItemController(service);

/**
 * @swagger
 * tags:
 *   name: Order Items
 *   description: Manajemen item dalam order/pesanan
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID order item
 *         order_id:
 *           type: integer
 *           description: ID order
 *         product_id:
 *           type: integer
 *           description: ID produk
 *         quantity:
 *           type: integer
 *           description: Jumlah produk
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
 *     OrderItemInput:
 *       type: object
 *       required:
 *         - order_id
 *         - product_id
 *         - quantity
 *       properties:
 *         order_id:
 *           type: integer
 *           example: 1
 *         product_id:
 *           type: integer
 *           example: 5
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           example: 2
 *     OrderItemUpdate:
 *       type: object
 *       properties:
 *         order_id:
 *           type: integer
 *         product_id:
 *           type: integer
 *         quantity:
 *           type: integer
 *           minimum: 1
 *     OrderItemWithDetails:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         order_id:
 *           type: integer
 *         product_id:
 *           type: integer
 *         quantity:
 *           type: integer
 *         product:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             price:
 *               type: number
 *         order:
 *           type: object
 *           properties:
 *             user_id:
 *               type: integer
 *             total:
 *               type: number
 */

/**
 * @swagger
 * /order-items:
 *   get:
 *     summary: Mendapatkan daftar order items (Admin only)
 *     tags: [Order Items]
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
 *         name: order_id
 *         schema:
 *           type: integer
 *         description: Filter berdasarkan ID order
 *       - in: query
 *         name: product_id
 *         schema:
 *           type: integer
 *         description: Filter berdasarkan ID produk
 *       - in: query
 *         name: min_quantity
 *         schema:
 *           type: integer
 *         description: Filter jumlah minimum
 *       - in: query
 *         name: max_quantity
 *         schema:
 *           type: integer
 *         description: Filter jumlah maksimum
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [quantity, createdAt, order_id, product_id]
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
 *         description: Daftar order items berhasil diambil
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
 *                     $ref: '#/components/schemas/OrderItem'
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
 *       403:
 *         description: Bukan admin
 */
router.get("/", authenticate, controller.list);

/**
 * @swagger
 * /order-items/stats:
 *   get:
 *     summary: Mendapatkan statistik order items (Admin only)
 *     tags: [Order Items]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistik order items berhasil diambil
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
 *       403:
 *         description: Bukan admin
 */
router.get("/stats", authenticate, controller.getStats);

/**
 * @swagger
 * /order-items/{id}:
 *   get:
 *     summary: Mendapatkan order item berdasarkan ID
 *     tags: [Order Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID order item
 *     responses:
 *       200:
 *         description: Order item berhasil diambil
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
 *                   $ref: '#/components/schemas/OrderItemWithDetails'
 *       401:
 *         description: Tidak terautentikasi
 *       404:
 *         description: Order item tidak ditemukan
 *     description: |
 *       Admin: Bisa melihat semua order items
 *       User: Hanya bisa melihat order items milik order sendiri
 */
router.get("/:id", authenticate, validate(getOrderItemByIdValidation), controller.getById);

/**
 * @swagger
 * /order-items:
 *   post:
 *     summary: Membuat order item baru
 *     tags: [Order Items]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderItemInput'
 *     responses:
 *       201:
 *         description: Order item berhasil dibuat
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
 *                   $ref: '#/components/schemas/OrderItem'
 *       400:
 *         description: Data tidak valid
 *       401:
 *         description: Tidak terautentikasi
 *       404:
 *         description: Order atau produk tidak ditemukan
 */
router.post("/", authenticate, validate(createOrderItemValidation), controller.create);

/**
 * @swagger
 * /order-items/{id}:
 *   put:
 *     summary: Mengupdate order item
 *     tags: [Order Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID order item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderItemUpdate'
 *     responses:
 *       200:
 *         description: Order item berhasil diupdate
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
 *                   $ref: '#/components/schemas/OrderItem'
 *       400:
 *         description: Data tidak valid
 *       401:
 *         description: Tidak terautentikasi
 *       404:
 *         description: Order item tidak ditemukan
 *     description: |
 *       Admin: Bisa mengupdate semua order items
 *       User: Hanya bisa mengupdate order items milik order sendiri
 */
router.put("/:id", authenticate, validate(updateOrderItemValidation), controller.update);

/**
 * @swagger
 * /order-items/{id}:
 *   delete:
 *     summary: Menghapus order item
 *     tags: [Order Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID order item
 *     responses:
 *       200:
 *         description: Order item berhasil dihapus
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
 *                   $ref: '#/components/schemas/OrderItem'
 *       401:
 *         description: Tidak terautentikasi
 *       404:
 *         description: Order item tidak ditemukan
 *     description: |
 *       Admin: Bisa menghapus semua order items
 *       User: Hanya bisa menghapus order items milik order sendiri
 */
router.delete("/:id", authenticate, validate(getOrderItemByIdValidation), controller.delete);

export default router;