import { Router } from 'express';
import * as authController from '../controllers/authController';
import protect from '@middleware/auth-middleware'

const user_routes = Router();

// User routes
user_routes.get('/get', protect, authController.get_user);
user_routes.post('/create', authController.create_user);
user_routes.post('/login', authController.login);
user_routes.post('/update', protect, authController.update_user);
user_routes.post('/recover-password', authController.recover_password);
user_routes.post('/change-password', authController.change_password);


export default user_routes;
