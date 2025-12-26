import { Router } from "express";
import { ProfileRepository } from "../repository/profile.repository";
import { validate } from "../utils/validation";
import { ProfileService } from "../services/profile.service";
import { ProfileController } from "../controllers/profile.controller";
import { authenticate } from "../middleware/auth.validation";
import { upload } from "../middleware/upload.validation";
import {
  createProfileValidation,
  updateProfileValidation,
  getProfileValidation,
  getUserProfileValidation,
} from "../middleware/profile.validation";
import prismaInstance from "../database";

const router = Router();

const repo = new ProfileRepository(prismaInstance);
const service = new ProfileService(repo, prismaInstance);
const controller = new ProfileController(service);

/**
 * @swagger
 * tags:
 *   name: Profiles
 *   description: Manajemen profil pengguna
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Profile:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID profil
 *         user_id:
 *           type: integer
 *           description: ID user pemilik profil
 *         name:
 *           type: string
 *           description: Nama lengkap
 *         gender:
 *           type: string
 *           enum: [MALE, FEMALE]
 *           nullable: true
 *         address:
 *           type: string
 *           nullable: true
 *         profile_picture_url:
 *           type: string
 *           nullable: true
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
 *     ProfileInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: "John Doe"
 *         gender:
 *           type: string
 *           enum: [MALE, FEMALE]
 *           example: "MALE"
 *         address:
 *           type: string
 *           example: "Jl. Contoh No. 123"
 *         profile_picture_url:
 *           type: string
 *           example: "/uploads/profile.jpg"
 *     ProfileUpdate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         gender:
 *           type: string
 *           enum: [MALE, FEMALE]
 *         address:
 *           type: string
 *         profile_picture_url:
 *           type: string
 *     ProfileResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         user_id:
 *           type: integer
 *         name:
 *           type: string
 *         gender:
 *           type: string
 *         address:
 *           type: string
 *         profile_picture_url:
 *           type: string
 *         user:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *             email:
 *               type: string
 *             role:
 *               type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /profiles:
 *   post:
 *     summary: Membuat profil baru (Auth required)
 *     tags: [Profiles]
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
 *             properties:
 *               name:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [MALE, FEMALE]
 *               address:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Profil berhasil dibuat
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
 *                   $ref: '#/components/schemas/Profile'
 *       400:
 *         description: Data tidak valid atau user sudah memiliki profil
 *       401:
 *         description: Tidak terautentikasi
 *       404:
 *         description: User tidak ditemukan
 */
router.post(
  "/",
  authenticate,
  upload.single("image"),
  validate(createProfileValidation),
  controller.create
);

/**
 * @swagger
 * /profiles:
 *   get:
 *     summary: Mendapatkan semua profil (Admin only)
 *     tags: [Profiles]
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
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter berdasarkan nama
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *           enum: [MALE, FEMALE]
 *         description: Filter berdasarkan gender
 *       - in: query
 *         name: address
 *         schema:
 *           type: string
 *         description: Filter berdasarkan alamat
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, createdAt, gender]
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
 *         description: Daftar profil berhasil diambil
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
 *                     $ref: '#/components/schemas/ProfileResponse'
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
 * /profiles/my-profile:
 *   get:
 *     summary: Mendapatkan profil sendiri (Auth required)
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil berhasil diambil
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
 *                   $ref: '#/components/schemas/ProfileResponse'
 *       401:
 *         description: Tidak terautentikasi
 *       404:
 *         description: Profil tidak ditemukan
 */
router.get("/my-profile", authenticate, controller.getMyProfile);

/**
 * @swagger
 * /profiles/user/{userId}:
 *   get:
 *     summary: Mendapatkan profil berdasarkan user ID
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID user pemilik profil
 *     responses:
 *       200:
 *         description: Profil berhasil diambil
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
 *                   $ref: '#/components/schemas/ProfileResponse'
 *       404:
 *         description: Profil tidak ditemukan
 */
router.get(
  "/user/:userId",
  validate(getUserProfileValidation),
  controller.getByUserId
);

/**
 * @swagger
 * /profiles/{id}:
 *   get:
 *     summary: Mendapatkan profil berdasarkan ID profil
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID profil
 *     responses:
 *       200:
 *         description: Profil berhasil diambil
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
 *                   $ref: '#/components/schemas/ProfileResponse'
 *       404:
 *         description: Profil tidak ditemukan
 */
router.get("/:id", validate(getProfileValidation), controller.getById);

/**
 * @swagger
 * /profiles/{id}:
 *   put:
 *     summary: Mengupdate profil (Auth required - pemilik profil atau admin)
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID profil
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProfileUpdate'
 *     responses:
 *       200:
 *         description: Profil berhasil diupdate
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
 *                   $ref: '#/components/schemas/Profile'
 *       400:
 *         description: Data tidak valid
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Tidak memiliki akses
 *       404:
 *         description: Profil tidak ditemukan
 */
router.put(
  "/:id",
  authenticate,
  validate(updateProfileValidation),
  controller.update
);

/**
 * @swagger
 * /profiles/{id}:
 *   delete:
 *     summary: Menghapus profil (soft delete - Auth required)
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID profil
 *     responses:
 *       200:
 *         description: Profil berhasil dihapus
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
 *                   $ref: '#/components/schemas/Profile'
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Tidak memiliki akses
 *       404:
 *         description: Profil tidak ditemukan
 *     description: |
 *       Admin: Bisa menghapus semua profil
 *       User: Hanya bisa menghapus profil sendiri
 */
router.delete("/:id", authenticate, controller.delete);

export default router;
