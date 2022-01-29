import { Request, RequestHandler } from 'express';
import Product from "../../models/Product";
import Joi from "@hapi/joi";
import { advancedResults } from '../../helpers/advancedResults'
import requestMiddleware from "@middleware/request-middleware";
import ProductBrand from "../../models/ProductBrand";
import ProductVariant from "../../models/ProductVariant";

export const get_product: RequestHandler = async (req: Request, res) => {
  let product: any = await advancedResults(req, Product, ["attachments", "category", "vendor", "user"])
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
export default requestMiddleware(get_product);
