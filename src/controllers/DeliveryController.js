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
      message: 'Delivery created successfully',
      delivery,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create delivery' });
  }
};

const getDeliveries = async (req, res) => {
  try {
    const deliveries = await prisma.delivery.findMany();
    res.status(200).json(deliveries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch deliveries' });
  }
};

const getDeliveryById = async (req, res) => {
  const { id } = req.params;

  try {
    const delivery = await prisma.delivery.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    res.status(200).json(delivery);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch delivery' });
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
      message: 'Delivery updated successfully',
      delivery,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update delivery' });
  }
};

const deleteDelivery = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.delivery.delete({
      where: { id: parseInt(id, 10) },
    });

    res.status(200).json({
      message: 'Delivery deleted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete delivery' });
  }
};

module.exports = {
  createDelivery,
  getDeliveries,
  getDeliveryById,
  updateDelivery,
  deleteDelivery,
};
