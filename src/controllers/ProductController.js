const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createProduct = async (req, res) => {
  const { name, description, price, stock, sizes, color, gender } = req.body;

  let images = [];
  let background = null;

  if (req.files) {
    if (req.files.images) {
      images = req.files.images.map((file) => ({ url: file.filename }));
    }

    if (req.files.background) {
      background = req.files.background[0].filename;
    }
  }

  console.log(req.body);
  console.log(images);
  console.log(background);

  try {
    let productData = {
      name,
      description,
      price: parseFloat(price),
      images: JSON.stringify(images),
      background,
      color,
      gender
    };

    let parsedSizes = [];

    if (sizes) {
      try {
        parsedSizes = JSON.parse(sizes);
      } catch (error) {
        return res.status(400).json({ error: "Formato de talla incorrecto" });
      }
    }

    if (parsedSizes.length === 0) {
      productData.stock = parseInt(stock);
    }

    const product = await prisma.product.create({
      data: productData,
    });

    if (parsedSizes.length > 0) {
      const sizeData = parsedSizes.map((size) => ({
        name: size.name,
        stock: parseInt(size.stock),
        productId: product.id,
      }));

      await prisma.size.createMany({
        data: sizeData,
      });
    }

    console.log(product);
    res.status(201).json({
      message: "Producto creado exitosamente",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Fallo la creacion de la orden de compra" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        sizes: true,
      },
    });
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Fallo la consulta de los productos" });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        sizes: true,
      },
    });
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "No se encontro el producto" });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, sizes, gender } = req.body;

  let images = [];
  if (req.files) {
    images = req.files.map((file) => ({ url: file.filename }));
  }

  try {
    let productData = {
      name,
      description,
      price: price ? parseFloat(price) : undefined,
      images: images.length > 0 ? JSON.stringify(images) : undefined,
      gender
    };

    let parsedSizes = [];

    if (sizes) {
      try {
        parsedSizes = JSON.parse(sizes);
      } catch (error) {
        return res.status(400).json({ error: "Tallas en formato incorrecto" });
      }
    }

    if (parsedSizes.length === 0) {
      productData.stock = stock ? parseInt(stock) : undefined;
    }

    const product = await prisma.product.update({
      where: {
        id: parseInt(id),
      },
      data: productData,
    });

    if (parsedSizes.length > 0) {
      await prisma.size.deleteMany({
        where: {
          productId: product.id,
        },
      });

      const sizeData = parsedSizes.map((size) => ({
        name: size.name,
        stock: parseInt(size.stock),
        productId: product.id,
      }));

      await prisma.size.createMany({
        data: sizeData,
      });
    }

    res.status(200).json({
      message: "Producto actualizado exitosamente",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Fallo la actualizacion del producto" });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.product.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.status(200).json({ message: "Producto eliminado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "No se pudo eliminar el producto" });
  }
};

module.exports = { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct };
