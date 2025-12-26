import { Router } from "express";
import {
  createProductValidation,
  getProductByIdValidation,
} from "../middleware/product.validation";
import { ProductRepository } from "../repository/product.repository";
import { validate } from "../utils/validation";
import { ProductService } from "../services/product.service";
import { ProductController } from "../controllers/product.controller";
import { authenticate } from "../middleware/auth.validation";
import { upload } from "../middleware/upload.validation";
import prismaInstance from "../prisma";

const router = Router();

const repo = new ProductRepository(prismaInstance);
const service = new ProductService(repo);
const controller = new ProductController(service);

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Manajemen produk e-commerce
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID produk
 *         name:
 *           type: string
 *           description: Nama produk
 *         description:
 *           type: string
 *           description: Deskripsi produk
 *         price:
 *           type: number
 *           format: float
 *           description: Harga produk
 *         stock:
 *           type: integer
 *           description: Stok produk
 *         image:
 *           type: string
 *           description: URL gambar produk
 *         categoryId:
 *           type: integer
 *           description: ID kategori produk
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
 *     ProductInput:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - stock
 *         - categoryId
 *       properties:
 *         name:
 *           type: string
 *           example: "iPhone 15 Pro"
 *         description:
 *           type: string
 *           example: "Smartphone flagship Apple"
 *         price:
 *           type: number
 *           format: float
 *           example: 15999999
 *         stock:
 *           type: integer
 *           example: 50
 *         categoryId:
 *           type: integer
 *           example: 1
 *     ProductUpdate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *           format: float
 *         stock:
 *           type: integer
 *         categoryId:
 *           type: integer
 *         image:
 *           type: string
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Mendapatkan daftar produk
 *     tags: [Products]
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
 *         name: search
 *         schema:
 *           type: string
 *         description: Pencarian berdasarkan nama produk
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, price, createdAt, stock]
 *         description: Kolom untuk sorting
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Urutan sorting
 *       - in: query
 *         name: min_price
 *         schema:
 *           type: number
 *         description: Filter harga minimum
 *       - in: query
 *         name: max_price
 *         schema:
 *           type: number
 *         description: Filter harga maksimum
 *     responses:
 *       200:
 *         description: Daftar produk berhasil diambil
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
 *                     $ref: '#/components/schemas/Product'
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
 */
router.get("/", controller.list);

/**
 * @swagger
 * /products/stats:
 *   get:
 *     summary: Mendapatkan statistik produk
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistik produk berhasil diambil
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
 */
router.get("/stats", controller.getStats);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Mendapatkan produk berdasarkan ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID produk
 *     responses:
 *       200:
 *         description: Produk berhasil diambil
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
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produk tidak ditemukan
 *       400:
 *         description: ID tidak valid
 */
router.get("/:id", validate(getProductByIdValidation), controller.getById);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Membuat produk baru (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - stock
 *               - categoryId
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               categoryId:
 *                 type: integer
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Produk berhasil dibuat
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
 *                   $ref: '#/components/schemas/Product'
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Bukan admin
 */
router.post(
  "/",
  authenticate,
  upload.single("image"),
  validate(createProductValidation),
  controller.create
);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Mengupdate produk berdasarkan ID (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID produk
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               categoryId:
 *                 type: integer
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Produk berhasil diupdate
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
 *                   $ref: '#/components/schemas/Product'
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Bukan admin
 *       404:
 *         description: Produk tidak ditemukan
 */
router.put(
  "/:id",
  authenticate,
  upload.single("image"),
  validate(createProductValidation),
  controller.update
);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Menghapus produk berdasarkan ID (soft delete, Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID produk
 *     responses:
 *       200:
 *         description: Produk berhasil dihapus
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
 *                   $ref: '#/components/schemas/Product'
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Bukan admin
 *       404:
 *         description: Produk tidak ditemukan
 */
router.delete("/:id", authenticate, controller.delete);

export default router;