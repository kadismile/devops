import { Router } from 'express';
import * as categoryController from '../controllers/categoryController';
import protect from "@middleware/auth-middleware";
import {multerUpload} from "@middleware/upload-midleware";

const category_routes = Router();

// Category routes
category_routes.get('/', categoryController.get_category);
category_routes.post('/create', protect, categoryController.create_category);
category_routes.post('/upload', protect, multerUpload, categoryController.upload_category_by_csv);
category_routes.delete('/remove', protect, categoryController.delete_category);
category_routes.put('/update', protect, categoryController.update_category);

export default category_routes;
