import {Request, RequestHandler} from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../../middleware/request-middleware';
import ProductVariant from '../../models/ProductVariant';
import accessEnv from "../../helpers/accessEnv";
import axios from "axios";

export const addProductSchema = Joi.object().keys({
  name: Joi.string().required(),
  categoryId: Joi.string().required(),
  specifications: Joi.array().required(),
  user: Joi.object()
});

const create_product_variant: RequestHandler = async (req: Request<{}, {}>, res) => {
  let doc = req.body
  let token: any = req.headers.authorization
  try {
    const productVariant = new ProductVariant({ name: doc.name, categoryId: doc.categoryId });
    await productVariant.save();
    let specDocs = {
      specifications: doc.specifications,
      productVariantId: [productVariant._id]
    }
    doc.productVariantId = productVariant.id
    await createSpecifications(specDocs, token)

    res.status(403).json({
      status: "success",
      data: productVariant
    });
  } catch (e: any) {
    res.status(403).json({
      status: "failed",
      message: e.message
    });
  }
};

const createSpecifications = async (doc: any, token: string) => {
  let response
  try {
    const DOMAIN_URL = accessEnv("DOMAIN_URL")
    const resp = await axios({
      method: 'post',
      url: `${DOMAIN_URL}/api/v1/specification/create`,
      data: doc,
      headers: {
        Authorization: token
      }})
    response = resp.data
  } catch (err: any) {
    response = err.response.data
  }
  return response
}

export default requestMiddleware(create_product_variant, { validation: { body: addProductSchema } });
