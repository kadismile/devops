import { Request, RequestHandler } from 'express';
import Product from "../../models/Product";
import { advancedResults } from '../../helpers/advancedResults'
import requestMiddleware from "@middleware/request-middleware";
import ProductBrand from "../../models/ProductBrand";
import ProductVariant from "../../models/ProductVariant";
import AdminProduct from '../../models/AdminProduct';
import Category from '../../models/Category';

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
  let categoryId = req.body.categoryId;
  const category:any = await Category.findOne({ _id: categoryId });
  if (category) {
    const products = await Product.find({ category: categoryId });
    const totalPrice = products.reduce(( a:number, b:any ) => a+b.price, 0);
    res.status(200).json({
      status: "success",
      data: {
        productCount: products.length,
        totalPrice
      }
    });
  } else {
    res.status(404).json({
      status: "failed",
      message: "invalid categoryId"
    });
  }

};
export default requestMiddleware(get_product);
