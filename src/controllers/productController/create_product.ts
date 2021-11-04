import { Request, RequestHandler } from 'express';
import Joi from '@hapi/joi';
import _ from 'lodash';
import requestMiddleware from '../../middleware/request-middleware';
import Product from '../../models/Product';
import Attachment from '../../models/Attachment';
import { uploads } from '../../integrations/cloudinary';
import * as fs from 'fs';
import User from '../../models/User';
import randomstring from 'randomstring';
import moment from 'moment';
import Category from '../../models/Category';

export const addProductSchema = Joi.object().keys({
  name: Joi.string().required(),
  description: Joi.string().required(),
  productVariantId: Joi.string().required(),
  price: Joi.number().required(),
  user: Joi.string().required(),
  vendor: Joi.string().required(),
  category: Joi.string().required(),
  productBrand: Joi.string().required(),
  condition: Joi.string().required(),
  specifications: Joi.array().required(),
});

const create_product: RequestHandler = async (req: Request<{}, {}>, res) => {
  try {
    let doc = req.body;
    const category = await Category.findById(doc.category).select({ specifications: 1, _id: 0 }).populate('specifications', { name: 1, _id: 0 });
    let files: any = req.files;
    if (!files || files.length === 0) {
      res.status(403).json({
        message: 'Kindly upload a file',
      });
    }
    const product = new Product(doc);
    await product.save();
    doc.productId = product._id;
    let urlAttachments = await uploadAttachments(files, doc);
    let response = await saveAttachments(urlAttachments, product, doc);
    res.status(200).json({
      data: response,
    });
  } catch (error: any) {
    res.status(500).json({ status: 'failed', message: error.message });
  }
};

const uploadAttachments = async (files: any, doc: any) => {
  let urls = [];
  for (const file of files) {
    const { path } = file;
    let newPath: any = await uploads(path, 'products');
    if (newPath?.url) {
      urls.push({
        _id: randomstring.generate(25),
        url: newPath.url,
        collectionId: newPath.id,
        user: doc.userId,
        product: doc.productId,
        createdAt: moment().toISOString(),
        updatedAt: moment().toISOString(),
      });
      await fs.unlinkSync(path);
    }
  }
  if (urls.length > 0) return urls;
};

const saveAttachments = async (urlAttachments: any, product: any, doc: any) => {
  let attachments = await Attachment.insertMany(urlAttachments);
  let attachmentId = _.map(attachments, '_id');
  let prod: any = await Product.findByIdAndUpdate(product._id, { $push: { attachments: attachmentId } }, { new: true, useFindAndModify: false });
  let user: any = await User.findByIdAndUpdate(doc.userId, { $push: { attachments: attachmentId } }, { new: true, useFindAndModify: false });
  return {
    status: 'success',
    user,
    product: prod,
  };
};
export default requestMiddleware(create_product, { validation: { body: addProductSchema } });
