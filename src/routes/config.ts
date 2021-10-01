// @ts-ignore
import indexRouter  from './index'
import user_routes from "./user_routes";
import vendor_routes from "./vendor_routes";
import product_routes from "./product_routes";


module.exports = [
  ['/', indexRouter],
  ['/api/v1/users', user_routes],
  ['/api/v1/vendors', vendor_routes],
  ['/api/v1/products', product_routes],
]