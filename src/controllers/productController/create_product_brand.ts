import {Request, RequestHandler} from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../../middleware/request-middleware';
import ProductBrand from '../../models/ProductBrand';

export const productBrandSchema = Joi.object().keys({
  name: Joi.string().required(),
  productVariantId: Joi.string().required()
});

const create_product_brand: RequestHandler = async (req: Request<{}, {}>, res) => {
  let doc = req.body
  try {
   let prodBrand = new ProductBrand(doc);
    await prodBrand.save()
    res.status(201).json({
      status: "success",
      data: prodBrand
    });
  } catch (e: any) {
    res.status(403).json({
      status: "failed",
      message: e.message
    });
  }
};


export default requestMiddleware(create_product_brand, { validation: { body: productBrandSchema } });
