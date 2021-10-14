import { Router } from 'express';
import * as productController from '../controllers/productController';
import {multerUpload} from "@middleware/upload-midleware";
import protect from "@middleware/auth-middleware";

const product_routes = Router();

product_routes.post('/create', protect, multerUpload, productController.create_product);
product_routes.post('/variant/create', protect, multerUpload, productController.create_product_variant);
product_routes.post('/brand/create', productController.create_product_brand);
product_routes.get('/get', protect, productController.get_product);
product_routes.get('/get/variant', protect, productController.get_variant);


export default product_routes;
