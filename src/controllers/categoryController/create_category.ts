import {Request, RequestHandler} from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../../middleware/request-middleware';
import Category from '../../models/Category';
import accessEnv from '../../helpers/accessEnv';
import axios from "axios"

export const addCategorySchema = Joi.object().keys({
  name: Joi.string().required(),
  specifications: Joi.array().required(),
  user: Joi.object().required(),
});

const create_category: RequestHandler = async (req: Request<{}, {}>, res) => {
  let doc = req.body
  let token: any = req.headers.authorization
  try {
   let category = new Category({ name: doc.name });
    await category.save()
    let specDocs = {
      specifications: doc.specifications,
      categoryId: [category._id]
    }
    doc.categoryId = category.id
    await createSpecifications(specDocs, token)

    res.status(201).json({
      data: await Category.findById(category._id).populate("specifications", { name: 1})
    });
  } catch (e: any) {
    res.status(403).json({
      status: "failed",
      message: e.message
    });
  }
};

const createSpecifications = async (doc: any, token: string) => {
  let response
  try {
    const DOMAIN_URL = accessEnv("DOMAIN_URL")
    const resp = await axios({
      method: 'post',
      url: `${DOMAIN_URL}/api/v1/specification/create`,
      data: doc,
      headers: {
        Authorization: token
      }})
    response = resp.data
  } catch (err: any) {
    response = err.response.data
  }
  return response
}

export default requestMiddleware(create_category, { validation: { body: addCategorySchema } });
