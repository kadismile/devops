import {Request, RequestHandler} from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../../middleware/request-middleware';
import Category from '../../models/Category';
import ProductBrand from "../../models/ProductBrand";

export const brandSchema = Joi.object().keys({
  brandId: Joi.string().required(),
  name: Joi.string().required(),
  user: Joi.object().required()
});

const update_brand: RequestHandler = async (req: Request<{}, {}>, res) => {
  let doc = req.body;
  try {
    let brand = await ProductBrand.findByIdAndUpdate(doc.brandId,
      {name: doc.name },
      { new: true, useFindAndModify: false }
    )
    res.status(200).json({
      status: "success",
      data: brand
    });
  } catch (e: any) {
    res.status(403).json({
      status: "failed",
      message: e.message
    });
  }
};

export default requestMiddleware(update_brand, { validation: { body: brandSchema } });
