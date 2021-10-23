import { Request, RequestHandler } from 'express';
import Product from "../../models/Product";
import Joi from "@hapi/joi";
import requestMiddleware from "@middleware/request-middleware";

export const productSchema = Joi.object().keys({
  vendorId: Joi.string().required(),
  user: Joi.object().required(),
});

const get_product: RequestHandler = async (req: Request, res) => {
  let doc:any = req.query
  let product = await  Product.find({})
    .populate("attachments",{ url: 1, _id: 0 })

  res.status(200).send({
    status: "success",
    data: product
  });
};
// @ts-ignore
export default requestMiddleware(get_product, { validation: { query: productSchema } });
