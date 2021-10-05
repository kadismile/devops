import {Request, RequestHandler} from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../../middleware/request-middleware';
import Specification from '../../models/Specification';


export const specificationSchema = Joi.object().keys({
  specificationId: Joi.string().required(),
});

const delete_specification: RequestHandler = async (req: Request<{}, {}>, res) => {
  let doc = req.body
  try {
    await Specification.findOneAndRemove({ _id: doc.specificationId });
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

export default requestMiddleware(delete_specification, { validation: { body: specificationSchema } });
