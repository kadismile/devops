import {Request, RequestHandler} from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../../middleware/request-middleware';
import Category from '../../models/Category';
import ProductBrand from "../../models/ProductBrand";
import Product from "../../models/Product";

export const brandSchema = Joi.object().keys({
  brandId: Joi.string().required(),
  name: Joi.string(),
  user: Joi.object().required(),
  isActive: Joi.boolean()
});

const update_brand: RequestHandler = async (req: Request<{}, {}>, res) => {
  let doc = req.body;
  let brand:any = await ProductBrand.findOne({_id: doc.brandId});
  try {
    if (doc.name) {
      brand = await ProductBrand.findByIdAndUpdate(doc.brandId,
        {name: doc.name },
        { new: true, useFindAndModify: false }
      );
    }
    if (brand.isActive !== doc.isActive) {
      brand = await ProductBrand.findByIdAndUpdate(
        doc.brandId, doc ,
        { new: true, useFindAndModify: false }
      )
      await Product.updateMany({productBrand: doc.brandId},
        { isActive: doc.isActive },
        { new: true, useFindAndModify: false, multi: true }
      )
    }
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
