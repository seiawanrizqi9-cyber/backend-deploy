import { successResponse } from "../utils/response";
import { createOrder, deleteOrder, getAllOrders, getOrderById, updateOrder, checkout as checkoutOrder, } from "../services/order.service";
export const getAll = async (_req, res) => {
    const { orders, total } = await getAllOrders();
    successResponse(res, "Order berhasil diambil", {
        jumlah: total,
        data: orders,
    });
};
export const getById = async (req, res) => {
    const order = await getOrderById(req.params.id);
    successResponse(res, "Order berhasil diambil", order);
};
export const create = async (req, res) => {
    const { user_id, total } = req.body;
    const data = {
        userId: Number(user_id),
        ...(total && { total: Number(total) }),
    };
    const order = await createOrder(data);
    successResponse(res, "Order berhasil dibuat", order, null, 201);
};
export const update = async (req, res) => {
    const order = await updateOrder(req.params.id, req.body);
    successResponse(res, "Order berhasil diupdate", order);
};
export const remove = async (req, res) => {
    const deleted = await deleteOrder(req.params.id);
    successResponse(res, "Order berhasil dihapus", deleted);
};
export const checkout = async (req, res) => {
    const data = req.body;
    const result = await checkoutOrder(data);
    successResponse(res, "Order berhasil dibuat", result, null, 201);
};
//# sourceMappingURL=order.controller.js.map