import { Router } from 'express';
import * as productController from '../controllers/productController';

const vendor_routes = Router();

vendor_routes.post('/create', productController.create_product);
vendor_routes.post('/type/create', productController.create_product_type);
vendor_routes.post('/category/create', productController.create_category);


export default vendor_routes;
