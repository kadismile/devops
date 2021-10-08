import {Request, RequestHandler} from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../../middleware/request-middleware';
import ProductVariant from '../../models/ProductVariant';

export const addProductSchema = Joi.object().keys({
  name: Joi.string().required(),
});

const create_product_type: RequestHandler = async (req: Request<{}, {}>, res) => {
  let doc = req.body
  try {
    const pType = new ProductVariant(req.body);
    await pType.save();
    res.status(403).json({
      status: "success",
      data: pType
    });
  } catch (e: any) {
    res.status(403).json({
      status: "failed",
      message: e.message
    });
  }
};

export default requestMiddleware(create_product_type, { validation: { body: addProductSchema } });
