import { Router } from 'express';
import * as vendorController from '../controllers/vendorController';
import protect from "@middleware/auth-middleware";

const vendor_routes = Router();

// Vendor routes
vendor_routes.post('/create', vendorController.create_vendor);
vendor_routes.get('/', vendorController.get_vendors);
vendor_routes.post('/', protect, vendorController.delete_vendor);
vendor_routes.post('/login', vendorController.login);

export default vendor_routes;
