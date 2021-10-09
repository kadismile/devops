import {Request, RequestHandler} from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../../middleware/request-middleware';
import Condition from '../../models/Conditions';


export const producVariantSchema = Joi.object().keys({
  name: Joi.string(),
  user: Joi.object().required()
});

const create_condition: RequestHandler = async (req: Request<{}, {}>, res) => {
  let doc = req.body
  try {
    let  condition = new Condition(doc)
    await condition.save();
    res.status(200).json({
      status: "success",
      data: condition
    });
  } catch (e: any) {
    res.status(403).json({
      status: "failed",
      message: e.message
    });
  }
};

export default requestMiddleware(create_condition, { validation: { body: producVariantSchema } });
