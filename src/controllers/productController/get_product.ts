import { Request, RequestHandler } from 'express';
import Product from "../../models/Product";
import Joi from "@hapi/joi";
import requestMiddleware from "@middleware/request-middleware";

export const gerProductSchema = Joi.object().keys({
  productId: Joi.string().required(),
});

const get_product: RequestHandler = async (req: Request, res) => {
  let doc = req.body
  let product = await  Product.findById(doc.productId).populate("attachments")
  return res.status(200).send({
    data: product
  });
};
export default requestMiddleware(get_product, { validation: { body: gerProductSchema } });
