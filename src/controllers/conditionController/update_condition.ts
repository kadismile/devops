import {Request, RequestHandler} from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../../middleware/request-middleware';
import _ from "lodash";
import Condition from "../../models/Conditions";

export const conditionSchema = Joi.object().keys({
  name: Joi.string().required(),
  conditionId: Joi.string().required(),
  categoryId: Joi.array(),
  user: Joi.object().required()
});

const update_condition: RequestHandler = async (req: Request<{}, {}>, res) => {
  let doc = req.body
  try {
    let condition: any = await Condition.findById(doc.conditionId)
    if (!condition) {
      res.status(404).json({
        status: "failed",
        message: "condition not found"
      });
    }
    let updatedCondition = await Condition.findByIdAndUpdate(
      doc.conditionId,
      { name: doc.name},
      { new: true, useFindAndModify: false }
    )
    res.status(200).json({
      status: "success",
      data: updatedCondition
    });

  } catch (e: any) {
    res.status(403).json({
      status: "failed",
      message: e.message
    });
  }
};

export default requestMiddleware(update_condition, { validation: { body: conditionSchema } });
