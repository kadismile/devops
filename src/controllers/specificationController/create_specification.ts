import {Request, RequestHandler} from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../../middleware/request-middleware';
import Specification from '../../models/Specification';
import Category from "../../models/Category";
import _ from "lodash";
import randomstring from "randomstring";
import moment from "moment";
import ProductVariant from "../../models/ProductVariant";


export const addSpecificationSchema = Joi.object().keys({
  name: Joi.string(),
  productVariantId: Joi.array(),
  specifications: Joi.array(),
  user: Joi.object().required()
});

const create_specification: RequestHandler = async (req: Request<{}, {}>, res) => {
  let doc = req.body
  try {
    let multiSpecifications
    let updatedDoc
    if (doc.specifications?.length > 0 ) {
      console.log("heloooooo-> ", doc.specifications)
      multiSpecifications = await createMultipleSpecifications(doc)
    } else {
      let  specification = new Specification(doc)
      await specification.save();
      updatedDoc = await Specification.findByIdAndUpdate(specification._id,
        { $push: { categories: doc.categoryId[0] } },
        { new: true, useFindAndModify: false }
      )
    }

    res.status(200).json({
      status: "success",
      data: multiSpecifications ? multiSpecifications : updatedDoc
    });
  } catch (e: any) {
    res.status(403).json({
      status: "failed",
      message: e.message
    });
  }
};

const createMultipleSpecifications = async (docs: any) => {
  const spec = docs.specifications.map((spec: any)=> {
    return {
      _id: randomstring.generate(25),
      name: spec.name,
      createdAt: moment().toISOString(),
      updatedAt: moment().toISOString(),
    }
  })
  let specifications = await Specification.insertMany(spec)
  let specificationIds = _.map(specifications, '_id')

  await Specification.updateMany(
    { _id: { $in: specificationIds } },
    { $set: { productVariants: docs.productVariantId[0] } },
    {multi: true}
  )

  await ProductVariant.findByIdAndUpdate(docs.productVariantId[0],
    { $push: { specifications: specificationIds } },
    { new: true, useFindAndModify: false }
  )
  return true
}

export default requestMiddleware(create_specification, { validation: { body: addSpecificationSchema } });
