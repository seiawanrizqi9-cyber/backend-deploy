import { successResponse } from "../utils/response";
import { createOrderItem, deleteOrderItem, getAllOrderItems, getOrderItemById, updateOrderItem, } from "../services/orderItems.service";
export const getAll = async (_req, res) => {
    const { orderItems, total } = await getAllOrderItems();
    successResponse(res, "Order items berhasil diambil", {
        jumlah: total,
        data: orderItems,
    });
};
export const getById = async (req, res) => {
    const orderItem = await getOrderItemById(req.params.id);
    successResponse(res, "Order item berhasil diambil", orderItem);
};
export const create = async (req, res) => {
    const { order_id, product_id, quantity } = req.body;
    const data = {
        order_id: Number(order_id),
        product_id: Number(product_id),
        quantity: Number(quantity),
    };
    const orderItem = await createOrderItem(data);
    successResponse(res, "Order item berhasil dibuat", orderItem, null, 201);
};
export const update = async (req, res) => {
    const orderItem = await updateOrderItem(req.params.id, req.body);
    successResponse(res, "Order item berhasil diupdate", orderItem);
};
export const remove = async (req, res) => {
    const deleted = await deleteOrderItem(req.params.id);
    successResponse(res, "Order item berhasil dihapus", deleted);
};
//# sourceMappingURL=orderItems.controller.js.map