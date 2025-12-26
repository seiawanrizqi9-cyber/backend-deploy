import { getPrisma } from "../prisma";
const prisma = getPrisma();
export const getAllOrderItems = async () => {
    const orderItems = await prisma.orderItem.findMany({
        include: { product: true, order: true },
        where: { deletedAt: null },
    });
    const total = orderItems.length;
    return { orderItems, total };
};
export const getOrderItemById = async (id) => {
    const numId = parseInt(id);
    const orderItem = await prisma.orderItem.findUnique({
        where: { id: numId, deletedAt: null },
        include: { product: true, order: true },
    });
    if (!orderItem) {
        throw new Error("Order item tidak ditemukan");
    }
    return orderItem;
};
export const createOrderItem = async (data) => {
    return await prisma.orderItem.create({
        data: {
            order_id: data.order_id,
            product_id: data.product_id,
            quantity: data.quantity,
        },
    });
};
export const updateOrderItem = async (id, data) => {
    await getOrderItemById(id); // Sama seperti product service
    const numId = parseInt(id);
    return await prisma.orderItem.update({
        where: { id: numId, deletedAt: null },
        data,
    });
};
export const deleteOrderItem = async (id) => {
    const numId = parseInt(id);
    return await prisma.orderItem.update({
        where: { id: numId, deletedAt: null },
        data: { deletedAt: new Date() },
    });
};
//# sourceMappingURL=orderItems.service.js.map