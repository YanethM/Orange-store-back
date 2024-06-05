const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createOrder = async (req, res) => {
    const { userId, products, total } = req.body;
    console.log(req.body);
    try {
        // Crea la orden
        const order = await prisma.orders.create({
            data: {
                user: {
                    connect: {
                        id: userId,
                    },
                },
                total: parseFloat(total),
            },
        });

        // Crea las relaciones OrderProduct
        const orderProducts = await Promise.all(
            products.map((product) =>
                prisma.orderProduct.create({
                    data: {
                        orderId: order.id,
                        productId: product.id,
                        quantity: product.quantity,
                    },
                })
            )
        );

        res.status(201).json({
            message: "Order and OrderProducts created successfully",
            order,
            orderProducts,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create Order and OrderProducts" });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await prisma.orders.findMany({
            include: {
                products: {
                    include: {
                        product: true,
                    },
                },
                user: true,
            },
        });
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch orders" });
    }
};


const getOrderById = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await prisma.orders.findUnique({
            where: {
                id: parseInt(id),
            },
            include: {
                products: {
                    include: {
                        product: true,
                    },
                },
                user: true,
            },
        });
        if (order) {
            res.status(200).json(order);
        } else {
            res.status(404).json({ error: "Order not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch order" });
    }
};


const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { products, total } = req.body;
  try {
    const order = await prisma.orders.update({
      where: {
        id: parseInt(id),
      },
      data: {
        total: parseFloat(total),
      },
    });

    // Eliminar las relaciones OrderProduct existentes
    await prisma.orderProduct.deleteMany({
      where: {
        orderId: order.id,
      },
    });

    // Crear las nuevas relaciones OrderProduct
    const orderProducts = await Promise.all(
      products.map((product) =>
        prisma.orderProduct.create({
          data: {
            orderId: order.id,
            productId: product.id,
            quantity: product.quantity,
          },
        })
      )
    );

    res.status(200).json({
      message: "Order and OrderProducts updated successfully",
      order,
      orderProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update order" });
  }
};

const deleteOrder = async (req, res) => {
    const { id } = req.params;
    try {
        // Eliminar las relaciones OrderProduct primero
        await prisma.orderProduct.deleteMany({
            where: {
                orderId: parseInt(id),
            },
        });

        // Luego, eliminar la orden
        await prisma.orders.delete({
            where: {
                id: parseInt(id),
            },
        });

        res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete order" });
    }
};

module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
};
