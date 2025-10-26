import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieOptions from "../utils/cookieOptions.js";
import { successResponse, errorResponse } from "../utils/response.js";

// register
export const register = async (req, res) => {
  const { name, username, password } = req.body;

  // Cek jika username sudah digunakan
  const existed = await prisma.user.findUnique({ where: { username } });
  if (existed) return errorResponse(res, "Username already in use!", null, 400);

  // Hash password sebelum simpan ke DB
  const hashed = await bcrypt.hash(password, 10);

  //simpan user baru ke db
  const user = await prisma.user.create({
    data: {
      name,
      username,
      password: hashed,
    },
  });

  return successResponse(res, "Registration successful!", {
    id: user.id,
    name: user.name,
    username: user.username,
  });
};

// login
export const login = async (req, res) => {
  const { username, password } = req.body;

  // Cari user
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return errorResponse(res, "Username not found!", null, 404);

  // Cocokkan password
  const match = await bcrypt.compare(password, user.password);
  if (!match) return errorResponse(res, "Wrong password!", null, 401);

  // Buat JWT Token
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("token", token, cookieOptions(req));

  return successResponse(res, "Login successful", {
    userId: user.id,
    username: username,
    token: token,
  });
};

// logout
export const logout = (req, res) => {
  res.clearCookie("token", {
    ...cookieOptions(req),
    maxAge: undefined, // override maxAge biar cookie benar-benar terhapus
  });
  return successResponse(res, "Logout successful!");
};
