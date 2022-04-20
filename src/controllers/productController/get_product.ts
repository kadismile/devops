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
  let product: any = await advancedResults(req, Product, ["attachments", "category", "vendor", "user", "productBrand"])
  if (product?.data) {
    res.status(200).json({
      status: "success",
      data: product
    });
  }
};

export const get_admin_product: RequestHandler = async (req: Request, res) => {
  let product: any = await advancedResults(req, AdminProduct, ["attachments", "category", "productBrand"])
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
  let productVariant: any = await advancedResults(req, ProductVariant, [])
  if (productVariant?.data) {
    res.status(200).json({
      status: "success",
      data: productVariant
    });
  }
};

export const get_product_by_category: RequestHandler = async (req: Request, res) => {
  const { vendorId } = req.body;

  const categories:any = await Category.find({}).select('_id');
  const categoryIds = _.map(categories, '_id');
  let data: any = [];

  if (categoryIds.length) {
    const products: any = await Product.find({ category: {$in: categoryIds}, vendor: vendorId }).select(['price', 'category']);
    const categories = await Category.find({ _id: {$in: categoryIds } }).select('name');

    for (let catId of categoryIds) {
      const category:any = categories.find( (cat) => cat.id === catId );
      const productsCategory = products.filter( (prod: any) => prod.category === catId );
      const totalPrice = productsCategory.reduce(( a:number, b:any ) => a + b.price, 0);
      data.push({
        "category": category.name,
        "totalNum": productsCategory.length,
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
