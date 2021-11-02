import { Request, RequestHandler } from 'express';
import Product from "../../models/Product";
import Joi from "@hapi/joi";
import { advancedResults } from '../../helpers/advancedResults'
import requestMiddleware from "@middleware/request-middleware";

export const productSchema = Joi.object().keys({
  vendorId: Joi.string(),
  user: Joi.object().required(),
});

const get_product: RequestHandler = async (req: Request, res) => {
  let doc:any = req.query
  let product: any = await advancedResults(req, Product, "attachments")
  if (product?.data) {
    res.status(200).json({
      status: "success",
      data: product
    });
  }
};
// @ts-ignore
export default requestMiddleware(get_product, { validation: { request: productSchema } });
