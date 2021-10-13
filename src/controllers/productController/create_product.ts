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
import Category from "../../models/Category";

export const addProductSchema = Joi.object().keys({
  /*name: Joi.string().required(),
  description: Joi.string().required(),
  productVariantId: Joi.string().required(),
  price: Joi.number().required(),
  user: Joi.string().required(),
  vendor: Joi.string().required(),
  category: Joi.string().required(),
  productBrand: Joi.string().required(),
  condition: Joi.string().required(),
  specifications: Joi.array().required()*/
});

const create_product: RequestHandler = async (req: Request<{}, {}>, res) => {
  try {
    let doc: any = {
      "name": "Iphone X",
      "description": "With new features and capabilities that let you get more done quickly and easily, iOS 11 makes iPhone more powerful, personal, and intelligent than ever.",
      "productVariantId": "mk2Hl9OGX8KTwSzgFiUHmoN17",
      "price": 175000,
      "user": "VjISjP94nL2q3zH7dNx1xBEry",
      "vendor": "7DyHM38pvnHFrHKakZdd6n2X1",
      "category": "MxbVegCaHNmKgtPuqKvs7gh63",
      "productBrand": "MxbVegCaHNmKgtPuqKvs7gh63",
      "specifications" : [{
        "MPN": "A123456",
        "Colour": "black",
        "Unlocked": "true",
        "Sim card format": "nano sim",
        "Storage": "125GB",
        "Memory": "4GB",
        "Model": "X series",
        "eSim": "sim",
        "Processor brand": "intel",
        "Processor core": "intel",
        "Megapixels": "220pixels",
        "OS": "ios",
        "Resolution": "1245 * 1245",
        "Screen type": "LED",
        "Network": "4g",
        "Release year": "2017",
        "Double sim": "false",
        "Memory card slot": "false",
        "Screen size": "1245",
        "Connector": "small",
        "Manufacturing reference number": "A12345",
        "Foldable": "false",
        "5G": "false",
        "Series": "10 series",
        "Brand" : "iphone x",
        "Price": 175000,
        "Battery health": "80*",
        "Warranty": "4 months",
        "Condition": "sparingly used"
      }],
      "condition": "Open-box"
      }

    const category = await Category.findById(doc.category)
      .select({ specifications: 1, _id: 0 })
      .populate("specifications", { name: 1, _id: 0})
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
