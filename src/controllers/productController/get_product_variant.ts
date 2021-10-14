import { Request, RequestHandler } from 'express';
import Product from "../../models/Product";
import Joi from "@hapi/joi";
import requestMiddleware from "@middleware/request-middleware";
import ProductVariant from "../../models/ProductVariant";

export const productSchema = Joi.object().keys({
  vendorId: Joi.string().required(),
  user: Joi.object().required(),
});

const get_variants: RequestHandler = async (req: Request, res) => {
  let doc:any = req.query
  let prodVariant = await  ProductVariant.find({ vendor: doc.vendorId })
    .populate("specifications",{ url: 1, _id: 0 })

  res.status(200).send({
    status: "success",
    data: prodVariant
  });
};
// @ts-ignore
export default requestMiddleware(get_variants, { validation: { query: productSchema } });
