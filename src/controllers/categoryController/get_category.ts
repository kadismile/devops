import { Request, RequestHandler } from 'express';
import requestMiddleware from '@middleware/request-middleware';
import Joi from "@hapi/joi";
import Category from "../../models/Category";


export const categorySchema = Joi.object().keys({
  categoryId: Joi.string().required(),
  user: Joi.object().required()
});

const get_category: RequestHandler = async (req: Request, res) => {
  let doc = req.body
  let category
  if (doc.categoryId) {
    category = await Category.findById(doc.categoryId).populate("specifications", { name: 1, _id: 0})
  } else {
    category = await Category.find({})
  }
  return res.status(200).send({
    status: "success",
    data: category
  });
};

export default requestMiddleware(get_category, { validation: { body: categorySchema } });
