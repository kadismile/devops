import { Router } from 'express';
import * as productController from '../controllers/productController';
import {multerUpload} from "@middleware/upload-midleware";
import protect from "@middleware/auth-middleware";

const vendor_routes = Router();

vendor_routes.post('/create', protect, multerUpload, productController.create_product);
vendor_routes.post('/type/create', productController.create_product_type);
vendor_routes.get('/get', protect, productController.get_product);


export default vendor_routes;
