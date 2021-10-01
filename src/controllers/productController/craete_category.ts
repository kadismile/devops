import {Request, RequestHandler} from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../../middleware/request-middleware';
import Category from '../../models/Category';

export const addCategorySchema = Joi.object().keys({
  name: Joi.string().required(),
});

const create_category: RequestHandler = async (req: Request<{}, {}>, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.send({
      data: category
    });

  } catch (e: any) {
    res.status(403).json({
      status: "failed",
      message: e.message
    });
  }
};

export default requestMiddleware(create_category, { validation: { body: addCategorySchema } });
