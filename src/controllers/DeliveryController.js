const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createDelivery = async (req, res) => {
  const { city, office, orderId, userId, status } = req.body;

  try {
    const delivery = await prisma.delivery.create({
      data: {
        city,
        office,
        orderId: parseInt(orderId, 10),
        userId: parseInt(userId, 10),
        status,
      },
    });

    res.status(201).json({
      message: 'Orden creada exitosamente',
      delivery,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocurrio un error al crear la orden de compra' });
  }
};

const getDeliveries = async (req, res) => {
  try {
    const deliveries = await prisma.delivery.findMany();
    res.status(200).json(deliveries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocurrio un error al consultar las ordenes de compra existentes.' });
  }
};

const getDeliveryById = async (req, res) => {
  const { id } = req.params;

  try {
    const delivery = await prisma.delivery.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!delivery) {
      return res.status(404).json({ error: 'La orden de compra no se encontro registrada en el sistema.' });
    }

    res.status(200).json(delivery);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocurrio un error al consultar la orden de compra' });
  }
};

const updateDelivery = async (req, res) => {
  const { id } = req.params;
  const { city, office, status } = req.body;

  try {
    const delivery = await prisma.delivery.update({
      where: {  id: parseInt(id)},
      data: {
        city,
        office,
        status,
      },
    });

    res.status(200).json({
      message: 'Orden de compra actualizada exitosamente',
      delivery,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar la orden de compra.' });
  }
};

const deleteDelivery = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.delivery.delete({
      where: { id: parseInt(id, 10) },
    });

    res.status(200).json({
      message: 'Orden de compra eliminada exitosamente',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'No se pudo eliminar la orden de compra' });
  }
};

module.exports = {
  createDelivery,
  getDeliveries,
  getDeliveryById,
  updateDelivery,
  deleteDelivery,
};
