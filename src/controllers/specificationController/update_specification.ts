import {Request, RequestHandler} from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../../middleware/request-middleware';
import Specification from '../../models/Specification';


export const updateSpecificationSchema = Joi.object().keys({
  name: Joi.string().required(),
  specificationId: Joi.string().required(),
  categoryId: Joi.array()
});

const update_specification: RequestHandler = async (req: Request<{}, {}>, res) => {
  let doc = req.body
  try {
    let specification: any = await Specification.findByIdAndUpdate(doc.specificationId,
      { name: doc.name, $push: { categories: doc.categoryId } },
      { new: true, useFindAndModify: false }
    )
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

export default requestMiddleware(update_specification, { validation: { body: updateSpecificationSchema } });
