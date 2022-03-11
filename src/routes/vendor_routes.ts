import { Router } from 'express';
import * as vendorController from '../controllers/vendorController';
import protect from "@middleware/auth-middleware";
import {
  addAccountRequestHandler,
  getAccountRequestHandler
} from '../controllers/vendorController/vendor_accounts';

const vendor_routes = Router();

// Vendor routes
vendor_routes.post('/create', vendorController.create_vendor);
vendor_routes.get('/', vendorController.get_vendors);
vendor_routes.post('/', protect, vendorController.delete_vendor);
vendor_routes.post('/login', vendorController.login);
vendor_routes.post('/account/add', protect, addAccountRequestHandler, vendorController.add_account_number);
vendor_routes.get('/account/get', protect, getAccountRequestHandler, vendorController.vendor_account_numbers);

export default vendor_routes;
