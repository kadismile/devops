import {Request, RequestHandler} from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../../middleware/request-middleware';
import Specification from '../../models/Specification';
import User from "../../models/User";

export const updateSpecificationSchema = Joi.object().keys({
  name: Joi.string().required(),
  specificationId: Joi.string().required(),
  categoryId: Joi.array().required()
});

const create_specification: RequestHandler = async (req: Request<{}, {}>, res) => {
  let doc = req.body
  try {
    let specification: any = await Specification.findByIdAndUpdate(doc.specificationId,
      { name: doc.name, $push: { categories: doc.categoryId } },
      { new: true, useFindAndModify: false }
    )
    /*await Specification.updateOne({ _id: doc.specificationId },
      {
        name: doc.name,
        $push: { categories: doc.categoryId}
    })*/
    res.status(200).json({
      status: "success",
      data: specification
    });

  } catch (e: any) {
    res.status(403).json({
      status: "failed",
      message: e.message
    });
  }
};

export default requestMiddleware(create_specification, { validation: { body: updateSpecificationSchema } });
