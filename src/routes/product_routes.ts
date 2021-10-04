import { Router } from 'express';
import * as productController from '../controllers/productController';
import {multerUpload} from "@middleware/upload-midleware";

const vendor_routes = Router();

vendor_routes.post('/create', multerUpload, productController.create_product);
vendor_routes.post('/type/create', productController.create_product_type);
vendor_routes.post('/category/create', productController.create_category);
vendor_routes.get('/get', productController.get_product);


export default vendor_routes;
