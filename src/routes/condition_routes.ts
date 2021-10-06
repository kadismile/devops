import { Router } from 'express';
import * as conditionController from '../controllers/conditionController';
import protect from "@middleware/auth-middleware";

const condition_routes = Router();

// Specification routes
condition_routes.post('/create', protect, conditionController.create_condition);
condition_routes.post('/update', protect, conditionController.update_condition);
condition_routes.delete('/delete', protect, conditionController.delete_condition);

export default condition_routes;
