import { Router } from 'express';
import * as specificationController from '../controllers/specificationController';
import protect from "@middleware/auth-middleware";

const specification_routes = Router();

// Specification routes
specification_routes.post('/create', protect, specificationController.create_specification);
specification_routes.post('/update', protect, specificationController.update_specification);

export default specification_routes;
