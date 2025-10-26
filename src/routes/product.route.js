import express from "express";
import { upload } from "../middlewares/upload.js";
import { verifyToken } from "../middlewares/verifyToken.js";

import {
  getAllProducts,
  getProduct,
  getProductByCategoryID,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

router.use(verifyToken);

router.get("/", getAllProducts);
router.get("/:id", getProduct);
router.get("/categories/:id", getProductByCategoryID);
router.post("/", upload.single("image"), createProduct);
router.put("/:id", upload.single("image"), updateProduct);
router.delete("/:id", deleteProduct);

export default router;
