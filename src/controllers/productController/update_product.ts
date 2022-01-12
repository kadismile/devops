import { Request, RequestHandler } from 'express';
import Product from '../../models/Product';
import Joi from '@hapi/joi';
import requestMiddleware from '@middleware/request-middleware';

export const productSchema = Joi.object().keys({
  productId: Joi.string(),
  name: Joi.string(),
  description: Joi.string(),
  productVariantId: Joi.string(),
  price: Joi.number(),
  vendor: Joi.string(),
  category: Joi.string(),
  productBrand: Joi.string(),
  condition: Joi.string(),
  specifications: Joi.array(),
  isActive: Joi.boolean(),
  attachment: Joi.array(),
  user: Joi.object().required(),
});

const update_product: RequestHandler = async (req: Request, res) => {
  let doc: any = req.body;
  let product: any = await Product.findById({ _id: doc.productId });
  if (product) {
    const product = await Product.findByIdAndUpdate(doc.productId, doc, {
      new: true,
      runValidators: true,
      useFindAndModify: false
    });

    /*if (doc.attachments.length) {
      
    }*/

    res.status(200).json({
      status: 'success',
      data: product,
    });
    
  } else {
    res.status(404).json({
      status: 'failed',
      message: `product with id ${doc.productId} not found`,
    });
  }
};
// @ts-ignore
export default requestMiddleware(update_product, { validation: { request: productSchema } });
