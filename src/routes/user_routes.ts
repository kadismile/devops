import { Router } from 'express';
import * as authController from '../controllers/authController';
import protect from '@middleware/auth-middleware'

const user_routes = Router();

user_routes.get('/get', protect, authController.get_user);
user_routes.get('/fetch', protect, authController.get_users);
user_routes.post('/create', authController.create_user);
user_routes.post('/login', authController.login);
user_routes.post('/login-token', authController.login_token);
user_routes.post('/update', protect, authController.update_user);
user_routes.post('/recover-password', authController.recover_password);
user_routes.post('/change-password', authController.change_password);

user_routes.post('/update-password', authController.updatePassword);


export default user_routes;
