import {Request, RequestHandler} from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../../middleware/request-middleware';
import Category from '../../models/Category';
import Product from "../../models/Product";


export const categorySchema = Joi.object().keys({
  categoryId: Joi.string().required(),
  name: Joi.string(),
  isActive: Joi.boolean(),
  specificationIds: Joi.array(),
  user: Joi.object().required()
});

const update_category: RequestHandler = async (req: Request<{}, {}>, res) => {
  let doc = req.body;
  try {
    let category;
    if (doc.specificationIds && doc.specificationIds.length) {
      category = await Category.findByIdAndUpdate(doc.categoryId,
        { $push: { specifications: doc.specificationIds } },
        { new: true, useFindAndModify: false }
      )
    } else {
      category = await Category.findByIdAndUpdate(
        doc.categoryId, doc ,
        { new: true, useFindAndModify: false }
      )
      await Product.updateMany({category: doc.categoryId},
        { isActive: doc.isActive },
        { new: true, useFindAndModify: false, multi: true }
      )
    }

    res.status(200).json({
      status: "success",
      data: category
    });
  } catch (e: any) {
    res.status(403).json({
      status: "failed",
      message: e.message
    });
  }
};

export default requestMiddleware(update_category, { validation: { body: categorySchema } });
