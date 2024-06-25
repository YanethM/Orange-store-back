const { PrismaClient } = require("@prisma/client");
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();
const allowedIdentifications = require('../middlewares/allowedIdentification');

const createUser = async (req, res) => {
  const {
    fullname,
    identification,
    email,
    password,
    cod_cost_center,
    cost_center,
    position,
    company,
    division,
    payment_city,
    associeted_vice_presidency,
    vice_presidency,
    role,
  } = req.body;

  const avatar = req.file ? req.file.filename : null;

  if (!allowedIdentifications.includes(identification)) {
    return res.status(400).json({ error: 'Identificacion no encontrada para crear el usuario' });
  }


  try {
    const user = await prisma.user.create({
      data: {
        fullname,
        identification,
        cod_cost_center: cod_cost_center ?? null,
        cost_center: cost_center ?? null,
        position: position ?? null,
        company: company ?? null,
        division: division ?? null,
        payment_city: payment_city ?? null,
        associeted_vice_presidency: associeted_vice_presidency ?? null,
        vice_presidency: vice_presidency ?? null,
        email,
        password: hashSync(password, 10),
        avatar,
        role,
      },
    });

    console.log(user);

    res.status(201).json({
      message: "Usuario creado exitosamente",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Algo salio mal en la creacion del usuario" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    console.log("Fetching users");
    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullname: true,
        identification: true,
        cod_cost_center: true,
        cost_center: true,
        position: true,
        company: true,
        division: true,
        payment_city: true,
        associeted_vice_presidency: true,
        vice_presidency: true,
        email: true,
        password: true,
        avatar: true,
        role: true,
      },
    });
    console.log(users);
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Fallo la consulta de los usuarios" });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  const userId = parseInt(id, 10);
  console.log(userId);
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Fallo la consulta del usuario" });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const userId = parseInt(id, 10);

  const {
    fullname,
    identification,
    cod_cost_center,
    cost_center,
    position,
    company,
    division,
    payment_city,
    associeted_vice_presidency,
    vice_presidency,
    email,
    password,
    role,
  } = req.body;

  const avatar = req.file ? req.file.filename : null;

  try {
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        fullname,
        identification,
        cod_cost_center: cod_cost_center ?? null,
        cost_center: cost_center ?? null,
        position: position ?? null,
        company: company ?? null,
        division: division ?? null,
        payment_city: payment_city ?? null,
        associeted_vice_presidency: associeted_vice_presidency ?? null,
        vice_presidency: vice_presidency ?? null,
        email,
        password: hashedPassword ? hashedPassword : undefined,
        avatar,
        role,
      },
    });

    res.status(200).json({
      message: "Usuario actualizado exitosamente",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Fallo la actualizacion del usuario" });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const userId = parseInt(id, 10);
  try {
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    res.status(200).json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "No se pudo eliminar el usuario" });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
