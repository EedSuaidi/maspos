import prisma from "../config/prisma.js";
import { successResponse, errorResponse } from "../utils/response.js";

// getAllCategories,
export const getAllCategories = async (req, res) => {
  const categories = await prisma.category.findMany();
  return successResponse(res, "Get all categories successful!", categories);
};

// getCategory,
export const getCategory = async (req, res) => {
  const { id } = req.params;
  const category = await prisma.category.findUnique({ where: { id } });

  if (!category) {
    return errorResponse(res, "ID category not found!", null, 404);
  } else {
    return successResponse(res, "Get category by ID successful!", category);
  }
};

// createCategory,
export const createCategory = async (req, res) => {
  const { name } = req.body;

  if (!name) return errorResponse(res, "Data cannot be empty!", null, 401);

  const category = await prisma.category.create({
    data: { name },
  });

  return successResponse(res, "Category created!", category);
};

// updateCategory,
export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) return errorResponse(res, "Data cannot be empty!", null, 401);

  const category = await prisma.category.update({
    where: { id },
    data: { name },
  });

  return successResponse(res, "Category updated!", category);
};

// deleteCategory,
export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  const category = await prisma.category.delete({
    where: { id },
  });

  return successResponse(res, "Category deleted!", category);
};
