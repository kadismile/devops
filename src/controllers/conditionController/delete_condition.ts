import {Request, RequestHandler} from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../../middleware/request-middleware';
import Specification from '../../models/Specification';
import Condition from "../../models/Conditions";

export const conditionSchema = Joi.object().keys({
  conditionId: Joi.string().required(),
  user: Joi.object().required()
});

const delete_condition: RequestHandler = async (req: Request<{}, {}>, res) => {
  let doc = req.body
  try {
    let condition: any = await Condition.findById(doc.conditionId)
    if (!condition) {
      res.status(404).json({
        status: "failed",
        message: "condition not found"
      });
    }
    await Condition.findByIdAndDelete(doc.conditionId);
    res.status(200).json({
      status: "success",
      message: "condition deleted"
    });
  } catch (e: any) {
    res.status(403).json({
      status: "failed",
      message: e.message
    });
  }
};

export default requestMiddleware(delete_condition, { validation: { body: conditionSchema } });
