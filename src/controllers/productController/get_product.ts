import { Request, RequestHandler } from 'express';
import Product from "../../models/Product";
import { advancedResults } from '../../helpers/advancedResults'
import requestMiddleware from "@middleware/request-middleware";
import ProductBrand from "../../models/ProductBrand";
import ProductVariant from "../../models/ProductVariant";
import AdminProduct from '../../models/AdminProduct';
import Category from '../../models/Category';
import _ from 'lodash';

export const get_product: RequestHandler = async (req: Request, res) => {
  let product: any = await advancedResults(req, Product, ["attachments", "category", "vendor", "user"])
  if (product?.data) {
    res.status(200).json({
      status: "success",
      data: product
    });
  }
};

export const get_admin_product: RequestHandler = async (req: Request, res) => {
  let product: any = await advancedResults(req, AdminProduct, ["attachments", "category"])
  if (product?.data) {
    res.status(200).json({
      status: "success",
      data: product
    });
  }
};

export const get_product_brand: RequestHandler = async (req: Request, res) => {
  let product: any = await advancedResults(req, ProductBrand, ["productvariant"])
  if (product?.data) {
    res.status(200).json({
      status: "success",
      data: product
    });
  }
};

export const get_product_variant: RequestHandler = async (req: Request, res) => {
  let productVariant: any = await advancedResults(req, ProductVariant, ["attachments"])
  if (productVariant?.data) {
    res.status(200).json({
      status: "success",
      data: productVariant
    });
  }
};

export const get_product_by_category: RequestHandler = async (req: Request, res) => {
  const categories:any = await Category.find({}).select('_id');
  const categoryIds = _.map(categories, '_id');
  let category: any;
  let data: any = [];
  if (categoryIds.length) {
    for (let catId of categoryIds) {
      category = await Category.findById(catId).select('name');
      const products = await Product.find({ category: catId });
      const totalPrice = products.reduce(( a:number, b:any ) => a + b.price, 0);
      data.push({
        "category": category.name,
        "totalNum": products.length,
        totalPrice
      })
    }
    res.status(200).json({
      status: "success",
      data
    });
  }

};
export default requestMiddleware(get_product);
