import {Request, RequestHandler} from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../../middleware/request-middleware';
import Product from '../../models/Product';

export const addProductSchema = Joi.object().keys({
  name: Joi.string().required(),
  description: Joi.string().required(),
  categoryId: Joi.string().required(),
  category: Joi.string().required(),
  productImage: Joi.string().required(),
});

const create_product: RequestHandler = async (req: Request<{}, {}>, res) => {
  try {
    const product = new Product(req.body)
    await product.save();
    res.send({
      data: product.toJSON()
    });
    } catch (e: any) {
    res.status(403).json({
      status: "failed",
      message: e.message
    });
  }
};


export default requestMiddleware(create_product, { validation: { body: addProductSchema } });
