import express from 'express';
import { addProduct, DeleteProduct, EditProduct, getAllProducts, GetOneProduct } from '../controllers/product.control.js';
import { upload } from '../utils/cloudinary.js';
import { verifyAdminToken } from '../middleware/verifyAdminToken.js';

const router = express.Router();

router.post('/addProduct', upload.single('image'), verifyAdminToken , addProduct);

// get all products
router.get('/getAllProducts', getAllProducts);

// get all products
router.get('/getOneProduct/:id', GetOneProduct);

// Edit 
router.put('/editProduct/:id', upload.single('image'), verifyAdminToken, EditProduct);

// Delete Product
router.delete('/deleteProduct/:id', verifyAdminToken, DeleteProduct);

export default router;