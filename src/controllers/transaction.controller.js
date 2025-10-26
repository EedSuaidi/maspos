import prisma from "../config/prisma.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const checkout = async (req, res) => {
  // get cart current user logged in
  const carts = await prisma.cart.findMany({
    where: { userId: req.user.userId },
    include: { product: true },
  });

  if (carts.length === 0) {
    return errorResponse(res, "Cart is empty!");
  }

  const items = carts
    .map((c) => `${c.product.name} x ${c.quantity}`)
    .join(", ");
  const total = carts.reduce((sum, item) => sum + item.total, 0);

  const transaction = await prisma.transaction.create({
    data: {
      items,
      total,
      date: new Date(),
      userId: req.user.id,
    },
  });

  // hapus cart hanya milik user ini
  await prisma.cart.deleteMany({
    where: { userId: req.user.userId },
  });

  return successResponse(res, "Checkout successful!", transaction);
};

// Get all transactions
export const getAllTransaction = async (req, res) => {
  try {
    const data = await prisma.transaction.findMany();
    return successResponse(res, "Get all transactions successful!", data);
  } catch (err) {
    return errorResponse(res, "Get all transactions failed!");
  }
};

// Get transaction by ID
export const getTransactionById = async (req, res) => {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id: req.params.id },
    });

    if (!transaction) {
      return errorResponse(res, "Transaction not found!");
    }

    return successResponse(
      res,
      "Get transaction by ID successful",
      transaction
    );
  } catch (err) {
    return errorResponse(
      res,
      "Get transaction by ID failed!",
      { error: err.message },
      500
    );
  }
};
