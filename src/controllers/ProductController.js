const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createProduct = async (req, res) => {
  const { name, description, price, stock } = req.body;
  const images = req.files.map((file) => {
    return { url: file.filename };
  }, []);
  console.log(req.body);
  console.log(images);
  try {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        images: JSON.stringify(images),
      },
    });
    console.log(product);
    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create product" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
}

const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;
    const images = req.files.map((file) => {
        return { url: file.filename };
    }
    );
    try {
        const product = await prisma.product.update({
        where: {
            id: parseInt(id),
        },
        data: {
            name,
            description,
            price: price ? parseFloat(price): undefined,
            stock: stock? parseInt(stock): undefined,
            images: JSON.stringify(images),
        },
        });
        res.status(200).json({
        message: "Product updated successfully",
        product,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update product" });
    }
    }

const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.product.delete({
        where: {
            id: parseInt(id),
        },
        });
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete product" });
    }
    }

module.exports = { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct };
