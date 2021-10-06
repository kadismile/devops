import {Request, RequestHandler} from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../../middleware/request-middleware';
import Specification from '../../models/Specification';


export const specificationSchema = Joi.object().keys({
  specificationId: Joi.string().required(),
  user: Joi.object().required()
});

const delete_specification: RequestHandler = async (req: Request<{}, {}>, res) => {
  let doc = req.body
  try {
    let specification: any = await Specification.findById(doc.specificationId)
    if (!specification) {
      res.status(404).json({
        status: "failed",
        message: "specification not found"
      });
    }
    await Specification.findByIdAndDelete(doc.specificationId);
    res.status(200).json({
      status: "success",
      message: "specification deleted"
    });
  } catch (e: any) {
    res.status(403).json({
      status: "failed",
      message: e.message
    });
  }
};

export default requestMiddleware(delete_specification, { validation: { body: specificationSchema } });
