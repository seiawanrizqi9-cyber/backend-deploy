import { createCategory, getAllCategories, getCategoryById, categoryUpdate, removeCategory } from '../services/category.service';
import { successResponse } from '../utils/response';
export const getAll = async (_req, res) => {
    const categories = await getAllCategories();
    successResponse(res, "Kategori berhasil diambil", categories, null, 200);
};
export const create = async (req, res) => {
    const category = await createCategory(req.body.name);
    successResponse(res, "Kategori berhasil ditambahkan", category, null, 201);
};
export const categoryId = async (req, res) => {
    const category = await getCategoryById(req.params.id);
    successResponse(res, "Kategori berhasil diambil", category, null, 200);
};
export const update = async (req, res) => {
    const category = await categoryUpdate(req.params.id, req.body.name);
    successResponse(res, "Kategori berhasil diupdate", category, null, 200);
};
export const remove = async (req, res) => {
    const category = await removeCategory(req.params.id);
    successResponse(res, "Kategori berhasil dihapus", category, null, 200);
};
//# sourceMappingURL=category.controller.js.map