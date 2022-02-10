import { Router } from 'express';
import * as orderController from '../controllers/orderController';
import protect from "@middleware/auth-middleware";

const order_routes = Router();

order_routes.post('/create', protect, orderController.create_order);
order_routes.get('/', protect, orderController.get_Order);
order_routes.post('/items/create', protect, orderController.create_order_items);

export default order_routes;
