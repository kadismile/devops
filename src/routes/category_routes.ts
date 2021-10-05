import { Router } from 'express';
import * as categoryController from '../controllers/categoryController';
import protect from "@middleware/auth-middleware";

const category_routes = Router();

// Category routes
category_routes.post('/create', protect, categoryController.create_category);

export default category_routes;
