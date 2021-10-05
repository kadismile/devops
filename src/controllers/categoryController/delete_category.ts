import {Request, RequestHandler} from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../../middleware/request-middleware';
import Category from '../../models/Category';


export const categorySchema = Joi.object().keys({
  categoryId: Joi.string().required(),
});

const delete_category: RequestHandler = async (req: Request<{}, {}>, res) => {
  let doc = req.body
  try {
    await Category.findOneAndRemove({ _id: doc.categoryId });
    res.status(200).json({
      message: "category deleted"
    });
  } catch (e: any) {
    res.status(403).json({
      status: "failed",
      message: e.message
    });
  }
};

export default requestMiddleware(delete_category, { validation: { body: categorySchema } });
