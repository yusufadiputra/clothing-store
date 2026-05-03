import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import authMiddleware from '../middleware/auth.middleware.js';
import {
  getAllProducts,
  getProductById,
  getMyProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller.js';

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const valid = allowed.test(path.extname(file.originalname).toLowerCase());
    valid ? cb(null, true) : cb(new Error('Hanya file gambar yang diizinkan'));
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.get('/', getAllProducts);
router.get('/my', authMiddleware, getMyProducts);
router.get('/:id', getProductById);
router.post('/', authMiddleware, upload.single('image'), createProduct);
router.put('/:id', authMiddleware, upload.single('image'), updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);

export default router;
