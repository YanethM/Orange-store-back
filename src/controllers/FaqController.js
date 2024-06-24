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
    res.status(500).json({ error: "Failed to create FAQ" });
  }
};

const getAllFaqs = async (req, res) => {
  try {
    const faqs = await prisma.faq.findMany();
    res.status(200).json(faqs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch FAQs" });
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
    res.status(500).json({ error: "Failed to fetch active FAQs" });
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
      res.status(404).json({ error: "FAQ not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch FAQ" });
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
    res.status(500).json({ error: "Failed to update FAQ" });
  }
};

const deleteFaq = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.faq.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: "FAQ deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete FAQ" });
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
