// @ts-ignore
import indexRouter  from './index'
import user_routes from "./user_routes";
import vendor_routes from "./vendor_routes";
import product_routes from "./product_routes";
import category_routes from "./category_routes";
import specification_routes from "./specification_routes";
import condition_routes from "./condition_routes";
import search_routes from "./search_routes";


module.exports = [
  ['/', indexRouter],
  ['/api/v1/users', user_routes],
  ['/api/v1/vendors', vendor_routes],
  ['/api/v1/products', product_routes],
  ['/api/v1/category', category_routes],
  ['/api/v1/specification', specification_routes],
  ['/api/v1/condition', condition_routes],
  ['/api/v1/search', search_routes],
]