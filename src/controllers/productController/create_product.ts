import { Request, RequestHandler } from 'express';
import Joi from '@hapi/joi';
import _ from 'lodash';
import requestMiddleware from '../../middleware/request-middleware';
import Product from '../../models/Product';
import Attachment from '../../models/Attachment';
import User from '../../models/User';
import Category from '../../models/Category';
import { uploadAttachments } from '../../helpers/uploadAttachments';

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
    let files: any = req.files;
    if (!files || files.length === 0) {
      res.status(403).json({
        message: 'Kindly upload a file',
      });
    }
    const product = new Product(doc);
    await product.save();
    doc.productId = product._id;
    let attachmentIds = await uploadAttachments(files, doc);
    let prod = await Product.findByIdAndUpdate(product._id, { $push: { attachments: attachmentIds } }, { new: true, useFindAndModify: false });

    res.status(200).json({
      status: 'success',
      data: prod,
    });
  } catch (error: any) {
    res.status(500).json({ status: 'failed', message: error.message });
  }
};

export default requestMiddleware(create_product, { validation: { body: addProductSchema } });
