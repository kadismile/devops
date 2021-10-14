import { Router } from 'express';
import * as search from '../controllers/searchService';

const search_routes = Router();
// Vendor routes
search_routes.post('/', search.search_service);


export default search_routes;
