import {Request, RequestHandler} from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../../middleware/request-middleware';
import Category from '../../models/Category';


export const categorySchema = Joi.object().keys({
  categoryId: Joi.string().required(),
  user: Joi.object().required()
});

const delete_category: RequestHandler = async (req: Request<{}, {}>, res) => {
  let doc = req.body
  try {
    let category = await Category.findOne({ _id: doc.categoryId })
    if (!category) {
      res.status(404).json({
        status: "failed",
        message: "category not found"
      });
    }
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
