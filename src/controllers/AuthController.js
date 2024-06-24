const { hashSync, compareSync } = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require('dotenv').config();

const signup = async (req, res) => {
  const { fullname, identification, email, password } = req.body;
  console.log(req.body);
  try {
    const user = await prisma.user.findFirst({
      where: {
        identification: identification,
      },
    });
    if (user) {
      res.status(400).json({ error: "User already exists" });
    } else {
      const newUser = await prisma.user.create({
        data: {
          fullname,
          identification,
          email,
          password: hashSync(password, 10),
        },
      });
      res.status(201).json(newUser);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create user" });
  }
};

const login = async (req, res) => {
  const { identification, password } = req.body;
  console.log(req.body);
  try {
    const user = await prisma.user.findFirst({
      where: {
        identification: identification,
      },
    });
    if (user) {
      const valid = compareSync(password, user.password);
      if (valid) {
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        res.status(200).json({
          token: token,
        });
      } else {
        console.log("Invalid credentials");
        res.status(401).json({ error: "Invalid credentials" });
      }
    } else {
      console.log("User not found");
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to login" });
  }
};

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).json({ error: "Token not provided" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.userId = decoded.id;
    next();
  });
};

const getSession = async (req, res) => {
  if (!req.headers.authorization) {
    return res.status(400).send("No token provided");
  }
  const token = req.headers.authorization.split(" ")[1];
  console.log(token);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    if (!decoded) {
      return res.status(400).send("Invalid token");
    }
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });
    console.log(user);
    if (!user) {
      return res.status(400).send("User not found");
    } else {
      // Crear una copia del usuario sin la contraseña
      const { password, ...userWithoutPassword } = user;
      res.status(200).json({
        message: "User found",
        user: userWithoutPassword,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error getting session",
      error,
    });
  }
};

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generar un token de restablecimiento de contraseña
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hora a partir de ahora

    // Guardar el token y su expiración en la base de datos
    await prisma.user.update({
      where: { email },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetTokenExpiry,
      },
    });

    // Configurar el transporte de nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetURL = `http://localhost:3002/auth/reset-password/${resetToken}`;

    // Enviar el correo electrónico con el enlace de restablecimiento de contraseña
    await transporter.sendMail({
      to: email,
      from: "no-reply@your-app.com",
      subject: "Cambia tu contraseña de tienda naranja",
      html: `<p>Da clic en el siguiente enlace para restablecer contraseña:</p>
             <p><a href="${resetURL}">${resetURL}</a></p>`,
    });

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send password reset email" });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          gte: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    // Actualizar la contraseña del usuario
    const hashedPassword = hashSync(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to reset password" });
  }
};


const logout = (req, res) => {
  res.status(200).json({ message: "Logout successful" });
};

module.exports = {
  signup,
  login,
  verifyToken,
  getSession,
  logout,
  requestPasswordReset,
  resetPassword
};
