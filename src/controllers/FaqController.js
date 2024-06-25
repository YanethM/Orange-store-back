const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createFaq = async (req, res) => {
  const { title, content, status } = req.body;

  try {
    const newFaq = await prisma.faq.create({
      data: {
        title,
        content,
        status,
      },
    });
    res.status(201).json(newFaq);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Fallo la creacion de la FAQ" });
  }
};

const getAllFaqs = async (req, res) => {
  try {
    const faqs = await prisma.faq.findMany();
    res.status(200).json(faqs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Fallo la consulta de las FAQs" });
  }
};

const getActiveFaqs = async (req, res) => {
  try {
    const faqs = await prisma.faq.findMany({
      where: { status: true },
    });
    res.status(200).json(faqs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Fallo la consulta de las FAQs activas" });
  }
};

const getFaqById = async (req, res) => {
  const { id } = req.params;

  try {
    const faq = await prisma.faq.findUnique({
      where: { id: parseInt(id) },
    });
    if (faq) {
      res.status(200).json(faq);
    } else {
      res.status(404).json({ error: "FAQ no encontrada" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "No se encontro la FAQ" });
  }
};

const updateFaq = async (req, res) => {
  const { id } = req.params;
  const { title, content, status } = req.body;

  try {
    const updatedFaq = await prisma.faq.update({
      where: { id: parseInt(id) },
      data: {
        title,
        content,
        status,
      },
    });
    res.status(200).json(updatedFaq);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Fallo la actualizacion de la FAQ" });
  }
};

const deleteFaq = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.faq.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: "FAQ eliminada exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Fallo la eliminacion de la FAQ" });
  }
};

module.exports = {
  createFaq,
  getAllFaqs,
  getFaqById,
  getActiveFaqs,
  updateFaq,
  deleteFaq,
};
