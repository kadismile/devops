import { Request, RequestHandler } from 'express';
import requestMiddleware from '@middleware/request-middleware';
import Joi from "@hapi/joi";
import Category from "../../models/Category";


export const categorySchema = Joi.object().keys({
  categoryId: Joi.string().required(),
});

const get_category: RequestHandler = async (req: Request, res) => {
  let doc = req.body
  let category
  if (doc.categoryId) {
    category = Category.findById(doc.categoryId)
  } else {
    category = Category.find({})
  }
  return res.status(200).send({
    data: category
  });
};

export default requestMiddleware(get_category, { validation: { body: categorySchema } });
