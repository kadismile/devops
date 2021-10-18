import {Request, RequestHandler} from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../../middleware/request-middleware';
import Category from '../../models/Category';

export const addCategorySchema = Joi.object().keys({
  name: Joi.string().required(),
  user: Joi.object().required(),
});

const create_category: RequestHandler = async (req: Request<{}, {}>, res) => {
  let doc = req.body
  let token: any = req.headers.authorization
  try {
   let category = new Category({ name: doc.name });
    await category.save()
    res.status(201).json({
      status: "success",
      data: await Category.findById(category._id).populate("specifications", { name: 1})
    });
  } catch (e: any) {
    res.status(403).json({
      status: "failed",
      message: e.message
    });
  }
};

export default requestMiddleware(create_category, { validation: { body: addCategorySchema } });
