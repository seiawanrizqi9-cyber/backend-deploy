import { successResponse } from "../utils/response";
import { createProduct, deleteProduct, getAllProducts, getProductById, searchProducts, updateProduct, } from "../services/product.service";
export const getAll = async (_req, res) => {
    const { products, total } = await getAllProducts();
    successResponse(res, "Produk berhasil diambil", {
        jumlah: total,
        data: products,
    });
};
export const getById = async (req, res) => {
    if (!req.params.id) {
        throw new Error("Paramnya gk ada wok");
    }
    const product = await getProductById(req.params.id);
    successResponse(res, "Produk berhasil diambil", product);
};
export const search = async (req, res) => {
    const { name, max_price, min_price } = req.query;
    const result = await searchProducts(name?.toString(), Number(max_price), Number(min_price));
    successResponse(res, "Produk berhasil diambil", result);
};
export const create = async (req, res) => {
    const { nama, deskripsi, harga, stock } = req.body;
    const data = {
        nama: nama.toString(),
        ...(deskripsi && { deskripsi: deskripsi }),
        harga: Number(harga),
        categoryId: Number(req.body.categoryId),
        stock: Number(stock),
    };
    const products = await createProduct(data);
    successResponse(res, "Produk berhasil ditambahkan", products, null, 201);
};
export const update = async (req, res) => {
    const product = await updateProduct(req.params.id, req.body);
    successResponse(res, "Produk berhasil diupdate", product);
};
export const remove = async (req, res) => {
    const deleted = await deleteProduct(req.params.id);
    successResponse(res, "Produk berhasil dihapus", deleted);
};
//# sourceMappingURL=product.controller.js.map