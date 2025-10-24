import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads"); // Pastikan folder `uploads/` sudah ada
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `product-${Date.now()}${ext}`; //product-1753682128110.png
    cb(null, filename);
  },
});

// 📌 Filter hanya menerima JPEG/JPG/PNG
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Hanya file JPEG/JPG/PNG yang diperbolehkan"));
};

export const upload = multer({ storage: storage, fileFilter });
