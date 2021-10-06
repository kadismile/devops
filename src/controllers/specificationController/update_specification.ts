import {Request, RequestHandler} from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../../middleware/request-middleware';
import Specification from '../../models/Specification';
import _ from "lodash";


export const updateSpecificationSchema = Joi.object().keys({
  name: Joi.string().required(),
  specificationId: Joi.string().required(),
  categoryId: Joi.array(),
  user: Joi.object().required()
});

const update_specification: RequestHandler = async (req: Request<{}, {}>, res) => {
  let doc = req.body
  try {
    let specification: any = await Specification.findById(doc.specificationId)
    if (!specification) {
      res.status(404).json({
        status: "failed",
        message: "specification not found"
      });
    }
    let uniqueCategories= _.union(specification.categories, doc.categoryId)
    let updatedSpecification = await Specification.findByIdAndUpdate(doc.specificationId,
      { name: doc.name, $push: { categories: uniqueCategories } },
      { new: true, useFindAndModify: false }
    )
    res.status(200).json({
      status: "success",
      data: updatedSpecification
    });

  } catch (e: any) {
    res.status(403).json({
      status: "failed",
      message: e.message
    });
  }
};

export default requestMiddleware(update_specification, { validation: { body: updateSpecificationSchema } });
