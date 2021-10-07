import {Request, RequestHandler} from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../../middleware/request-middleware';
import Category from '../../models/Category';


export const categorySchema = Joi.object().keys({
  categoryId: Joi.string().required(),
  specificationIds: Joi.array()
});

const update_category: RequestHandler = async (req: Request<{}, {}>, res) => {
  let doc = req.body
  try {
    let category = await Category.findByIdAndUpdate(doc.categoryId,
      {name: doc.name, $push: { specifications: doc.specificationIds } },
      { new: true, useFindAndModify: false }
    )
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
