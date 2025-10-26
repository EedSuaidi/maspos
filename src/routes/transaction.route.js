import express from "express";
import {
  checkout,
  getAllTransaction,
  getTransactionById,
} from "../controllers/transaction.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();
router.use(verifyToken);

router.post("/checkout", checkout);
router.get("/", getAllTransaction);
router.get("/:id", getTransactionById);

export default router;
