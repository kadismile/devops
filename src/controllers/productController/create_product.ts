import {Request, RequestHandler} from 'express';
import Joi from '@hapi/joi';
import _ from 'lodash'
import requestMiddleware from '../../middleware/request-middleware';
import Product from '../../models/Product';
import Attachment from '../../models/Attachment';
import { uploads }  from '../../integrations/cloudinary'
import * as fs from "fs";
import User from "../../models/User";
import randomstring from "randomstring";
import moment from "moment";

export const addProductSchema = Joi.object().keys({
  /*name: Joi.string().required(),
  description: Joi.string().required(),
  categoryId: Joi.string().required(),
  category: Joi.string().required(),
  productImage: Joi.string().required(),*/
});

const create_product: RequestHandler = async (req: Request<{}, {}>, res) => {
  try {
    let doc: any = {
        name: "iPhone",
        description: "a good phone with good quality",
        categoryId: "qs6Falw8lhPbyMDFGWMQndUnb",
        category: "smart phones",
        userId: "WhMDpxEosk4taTkZEyRO36m0A"
      }
    await Attachment.deleteMany({})
    await Product.deleteMany({})
    let files: any = req.files;
    if (!files || files.length === 0) {
      res.status(403).json({
        message: "Kindly upload a file"
      });
    }
    const product = new Product(doc);
    await product.save();
    doc.productId = product._id;
    let urlAttachments = await uploadAttachments(files, doc);
    let response = await saveAttachments(urlAttachments, product, doc);
    res.status(200).json({
      data: response
    });
  } catch (error: any) {
    res.status(500).json({status: 'failed', message: error.message})
  }
};

const uploadAttachments = async (files: any, doc: any) => {
  let urls = []
  for (const file of files) {
    const { path } = file
    let newPath: any = await uploads(path, 'products')
    if (newPath?.url) {
      urls.push({
        _id: randomstring.generate(25),
        url: newPath.url,
        collectionId: newPath.id,
        user: doc.userId,
        product: doc.productId,
        createdAt: moment().toISOString(),
        updatedAt: moment().toISOString(),
      })
      await fs.unlinkSync(path)
    }
  }
  if (urls.length > 0)
    return urls
}
const saveAttachments = async (urlAttachments: any, product: any, doc: any) => {
  let attachments = await Attachment.insertMany(urlAttachments)
  let attachmentId = _.map(attachments, '_id')
  let prod: any = await Product.findByIdAndUpdate(product._id,
    { $push: { attachments: attachmentId } },
    { new: true, useFindAndModify: false }
  )
  let user: any = await User.findByIdAndUpdate(doc.userId,
    { $push: { attachments: attachmentId } },
    { new: true, useFindAndModify: false }
  )
  return {
    status: "success",
    user,
    product: prod
  }
}
export default requestMiddleware(create_product, { validation: { body: addProductSchema } });
