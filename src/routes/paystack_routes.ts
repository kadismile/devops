import { Router } from 'express';
import * as paystackController from '../controllers/paystackController';

const paystack_routes = Router();

// Paystack routes
paystack_routes.get('/banks', paystackController.get_banks);
paystack_routes.get('/resolve-account', paystackController.resolve_account_number);

export default paystack_routes;
