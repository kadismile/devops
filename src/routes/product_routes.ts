import { Router } from 'express';
import * as productController from '../controllers/productController';
import {multerUpload} from "@middleware/upload-midleware";
import protect from "@middleware/auth-middleware";


const product_routes = Router();

product_routes.post('/create', protect, multerUpload, productController.create_product);
product_routes.post('/upload', protect, multerUpload, productController.upload_products_by_csv);
product_routes.post('/variant/create', protect, multerUpload, productController.create_product_variant);
product_routes.post('/brand/create', productController.create_product_brand);
product_routes.get('/brands', protect, productController.get_product_brand);
product_routes.post('/brand/delete', protect, productController.delete_product_brand);
product_routes.post('/brand/update', protect, productController.update_brand);
product_routes.post('/brand/upload', protect, multerUpload, productController.upload_brand_by_csv);
product_routes.get('/', productController.get_product);
product_routes.post('/category', protect, productController.get_product_by_category);
product_routes.get('/admin', productController.get_admin_product);
product_routes.post('/update', protect, multerUpload, productController.update_product);
product_routes.get('/variants', productController.get_product_variant);
product_routes.post('/variants/upload', multerUpload, productController.upload_variant_by_csv);
product_routes.post('/variant/delete', protect, productController.delete_variant);
product_routes.post('/variant/update', protect, productController.update_variant);


export default product_routes;
