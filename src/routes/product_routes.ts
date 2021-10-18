import { Router } from 'express';
import * as productController from '../controllers/productController';
import {multerUpload} from "@middleware/upload-midleware";
import protect from "@middleware/auth-middleware";

const vendor_routes = Router();

vendor_routes.post('/create', protect, multerUpload, productController.create_product);
vendor_routes.post('/brand/create', productController.create_product_brand);
vendor_routes.get('/get', productController.get_product);


export default vendor_routes;
