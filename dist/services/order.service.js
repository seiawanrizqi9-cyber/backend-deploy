import { getPrisma } from "../prisma";
const prisma = getPrisma();
export const getAllOrders = async () => {
    const orders = await prisma.order.findMany({
        where: { deletedAt: null },
    });
    const total = orders.length;
    return { orders, total };
};
export const getOrderById = async (id) => {
    const numId = parseInt(id);
    const order = await prisma.order.findUnique({
        where: { id: numId, deletedAt: null },
    });
    if (!order) {
        throw new Error("Order tidak ditemukan");
    }
    return order;
};
export const createOrder = async (data) => {
    return await prisma.order.create({
        data: {
            user_id: data.user_id,
            total: data.total || 0,
        },
    });
};
export const updateOrder = async (id, data) => {
    await getOrderById(id);
    const numId = parseInt(id);
    return await prisma.order.update({
        where: { id: numId, deletedAt: null },
        data,
    });
};
export const checkout = async (data) => {
    let total = 0;
    const product_id = data.orderItems.map((i) => i.product_id);
    for (const id of product_id) {
        const price = await prisma.product.findUnique({
            where: { id },
            select: { price: true },
        });
        total += Number(price);
    }
    try {
        const result = await prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    user_id: data.user_id,
                    total: total,
                },
            });
            for (const item of data.orderItems) {
                await tx.orderItem.create({
                    data: {
                        order_id: newOrder.id,
                        product_id: item.product_id,
                        quantity: item.quantity,
                    },
                });
            }
            return newOrder;
        });
        return result;
    }
    catch (error) {
        throw new Error("Gagal membuat order");
    }
};
export const deleteOrder = async (id) => {
    const numId = parseInt(id);
    return await prisma.order.update({
        where: { id: numId, deletedAt: null },
        data: { deletedAt: new Date() },
    });
};
//# sourceMappingURL=order.service.js.map