const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


const createOrder = async (req, res) => {
  const { userId, products, isPaid } = req.body; // Añadir isPaid al cuerpo de la solicitud
  try {
    // Calcular el total de la orden
    let total = 0;
    for (const product of products) {
      const productData = await prisma.product.findUnique({
        where: {
          id: product.id,
        },
        include: {
          sizes: true,
        },
      });

      if (productData.sizes.length > 0) {
        // Producto con tallas
        const sizeData = productData.sizes.find(
          (size) => size.id === product.sizeId
        );
        if (!sizeData || sizeData.stock < product.quantity) {
          return res.status(400).json({
            error: `Not enough stock for size ${product.sizeId} of product ${productData.name}`,
          });
        }

        total += productData.price * product.quantity;
      } else {
        // Producto sin tallas
        if (productData.stock < product.quantity) {
          return res.status(400).json({
            error: `Not enough stock for product ${productData.name}`,
          });
        }

        total += productData.price * product.quantity;
      }
    }

    // Crea la orden
    const order = await prisma.orders.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        total: total,
        isPaid: isPaid || false, // Asignar el valor de isPaid, por defecto false si no se proporciona
      },
    });

    // Solo actualizar el stock si la orden está pagada
    if (order.isPaid) {
      // Crea las relaciones OrderProduct y actualiza el stock
      const orderProducts = await Promise.all(
        products.map(async (product) => {
          if (product.sizeId) {
            // Producto con tallas
            await prisma.size.update({
              where: {
                id: product.sizeId,
              },
              data: {
                stock: {
                  decrement: product.quantity,
                },
              },
            });
          } else {
            // Producto sin tallas
            await prisma.product.update({
              where: {
                id: product.id,
              },
              data: {
                stock: {
                  decrement: product.quantity,
                },
              },
            });
          }

          return prisma.orderProduct.create({
            data: {
              orderId: order.id,
              productId: product.id,
              quantity: product.quantity,
              sizeId: product.sizeId || null,
            },
          });
        })
      );

      res.status(201).json({
        message: "Order and OrderProducts created successfully",
        order,
        orderProducts,
      });
    } else {
      res.status(201).json({
        message: "Order created successfully, but stock was not decremented as the order is not paid.",
        order,
      });
    }
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
  const { products, isPaid } = req.body; // Añadir isPaid al cuerpo de la solicitud
  try {
    // Calcular el total de la orden
    let total = 0;
    for (const product of products) {
      const productData = await prisma.product.findUnique({
        where: {
          id: product.id,
        },
      });
      total += productData.price * product.quantity;
    }

    // Actualizar la orden con el nuevo total y estado de pago
    const order = await prisma.orders.update({
      where: {
        id: parseInt(id),
      },
      data: {
        total: total,
        isPaid: isPaid, // Actualizar el estado de pago
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
            sizeId: product.sizeId || null, // Añadir sizeId si está presente
          },
        })
      )
    );

    // Solo actualizar el stock si la orden está pagada
    if (order.isPaid) {
      await Promise.all(
        products.map(async (product) => {
          if (product.sizeId) {
            // Producto con tallas
            await prisma.size.update({
              where: {
                id: product.sizeId,
              },
              data: {
                stock: {
                  decrement: product.quantity,
                },
              },
            });
          } else {
            // Producto sin tallas
            await prisma.product.update({
              where: {
                id: product.id,
              },
              data: {
                stock: {
                  decrement: product.quantity,
                },
              },
            });
          }
        })
      );
    }

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

const getOrderByUserId = async (req, res) => {
  const { userId } = req.params;
  console.log(userId);
  try {
      const orders = await prisma.orders.findMany({
          where: {
              userId: parseInt(userId),
          },
          include: {
              products: {
                  include: {
                      product: {
                          include: {
                              sizes: true,
                          },
                      },
                  },
              },
          },
      });
      res.status(200).json(orders);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener las ordenes' });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getOrderByUserId,
};
