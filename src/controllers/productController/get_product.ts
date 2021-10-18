import { Request, RequestHandler } from 'express';
import Product from "../../models/Product";
import Joi from "@hapi/joi";
import { paginate } from '../../helpers/pagination'
import requestMiddleware from "@middleware/request-middleware";

export const productSchema = Joi.object().keys({
  vendorId: Joi.string(),
  user: Joi.object().required(),
});

const get_product: RequestHandler = async (req: Request, res) => {
  let doc:any = req.query
  let product
  if (doc.vendorId) {
    product = await Product.find({ vendor: doc.vendorId })
      .populate("attachments",{ url: 1, _id: 0 })
  } else {
    product = await paginate(req, Product, "attachments")
  }
  res.status(200).send(product);
};
// @ts-ignore
export default requestMiddleware(get_product, { validation: { query: productSchema } });
