const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


const createProduct = async (req, res) => {
  const { name, description, price, stock, sizes, color } = req.body;

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

    // Crear tallas asociadas al producto y al género si se proporciona
    if (parsedSizes.length > 0) {
      const sizeData = parsedSizes.map((size) => ({
        sizeName: size.sizeName,
        stock: parseInt(size.stock),
        productId: product.id,
        gender: size.gender || null, // Asignar el género de la talla si se proporciona
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
    res.status(500).json({ error: "Fallo la creación del producto" });
  }
};


const getProductsByGenderAndSize = async (req, res) => {
  const { gender } = req.query;

  if (!gender) {
    return res.status(400).json({
      error: "El parámetro gender es requerido.",
    });
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        sizes: {
          some: {
            gender: gender,
          },
        },
      },
      include: {
        sizes: {
          where: {
            gender: gender,
          },
        },
      },
    });

    if (products.length === 0) {
      return res.status(404).json({
        message: "No se encontraron productos para el género especificado.",
      });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al consultar los productos" });
  }
};


const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        sizes: true
      },
    });

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al consultar los productos" });
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

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Fallo la consulta del producto" });
  }
};


const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, sizes, color } = req.body;

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
    // Obtener el producto actual para mantener las imágenes y el fondo si no se proporcionan nuevos datos
    const currentProduct = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!currentProduct) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    let productData = {
      name,
      description,
      price: parseFloat(price),
      images: images.length > 0 ? JSON.stringify(images) : currentProduct.images,
      background: background || currentProduct.background,
      color,
    };

    if (stock) {
      productData.stock = parseInt(stock);
    }

    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: productData,
    });

    if (sizes && sizes.length > 0) {
      // Eliminar tallas existentes
      await prisma.size.deleteMany({
        where: { productId: updatedProduct.id },
      });

      // Crear nuevas tallas
      const sizeData = sizes.map((size) => ({
        sizeName: size.sizeName,
        stock: parseInt(size.stock),
        productId: updatedProduct.id,
        gender: size.gender || null,
      }));

      await prisma.size.createMany({
        data: sizeData,
      });
    }

    console.log(updatedProduct);
    res.status(200).json({
      message: "Producto actualizado exitosamente",
      updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Fallo la actualización del producto" });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: { sizes: true, orders: true },
    });

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Eliminar todas las tallas asociadas
    await prisma.size.deleteMany({
      where: { productId: parseInt(id) },
    });

    // Eliminar todas las asociaciones de OrderProduct
    await prisma.orderProduct.deleteMany({
      where: { productId: parseInt(id) },
    });

    // Finalmente, eliminar el producto
    await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "Producto eliminado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Fallo la eliminación del producto" });
  }
};


module.exports = { createProduct, getProductsByGenderAndSize, getAllProducts, getProductById, updateProduct, deleteProduct };
