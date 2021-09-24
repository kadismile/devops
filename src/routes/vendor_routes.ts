import { Router } from 'express';
import * as vendorController from '../controllers/vendorController';

const vendor_routes = Router();

// Vendor routes
vendor_routes.post('/create', vendorController.create_vendor);


export default vendor_routes;
