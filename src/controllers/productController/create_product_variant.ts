import {Request, RequestHandler} from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../../middleware/request-middleware';
import ProductVariant from '../../models/ProductVariant';
import accessEnv from "../../helpers/accessEnv";
import axios from "axios";
import CSVToJSON from "csvtojson";
import * as fs from "fs";
import Specification from "../../models/Specification";
import _ from "lodash";
import Category from "../../models/Category";
import Product from "../../models/Product";
import ProductBrand from '../../models/ProductBrand';
import AdminProduct from '../../models/AdminProduct';

export const addProductSchema = Joi.object().keys({
  name: Joi.string().required(),
  categoryId: Joi.string().required(),
  specifications: Joi.array().required(),
  user: Joi.object()
});

const create_product_variant: RequestHandler = async (req: Request<{}, {}>, res) => {
  let doc = req.body
  let token: any = req.headers.authorization
  try {
    const productVariant = new ProductVariant({ name: doc.name, categoryId: doc.categoryId });
    await productVariant.save();
    let specDocs = {
      specifications: doc.specifications,
      productVariantId: [productVariant._id]
    }
    doc.productVariantId = productVariant._id
    await createSpecifications(specDocs, token)

    res.status(403).json({
      status: "success",
      data: productVariant
    });
  } catch (e: any) {
    res.status(403).json({
      status: "failed",
      message: e.message
    });
  }
};

export default requestMiddleware(create_product_variant, { validation: { body: addProductSchema } });

export const upload_variant_by_csv: RequestHandler = async (req: Request<{}, {}>, res) => {
  try {
    const files: any = req.files;
    if (!files || files.length === 0) {
      res.status(403).json({
        message: 'Kindly upload a csv file',
      });
    }
    try {
      let variantCsv =  await CSVToJSON().fromFile(`./attachments/csv/${files[0].originalname}`);
      let errors: any = [];
      if (variantCsv.length) {
        for (const variant of variantCsv) {
          const validation: any = await validateCsvAndCreate(variant);
          if (validation) {
            errors.push(validation);
          }
        }
        await fs.unlinkSync(`./attachments/csv/${files[0].originalname}`)
      } else {
        res.status(403).json({
          error: 'invalid file format',
        });
      }

    } catch (e) {
      res.status(403).json({
        error: e,
      });
    }
    res.status(200).json({
      status: 'success',
      data: 'product variant successfully uploaded via csv',
    });
  } catch (error: any) {
    res.status(500).json({ status: 'failed', message: error.message });
  }
};

export const delete_variant: RequestHandler = async (req: Request<{}, {}>, res) => {
  let doc = req.body;
  try {
    let pVariant = await ProductVariant.findOne({ _id: doc.variantId })
    if (!pVariant) {
      res.status(404).json({
        status: "failed",
        message: "product variant  not found"
      });
    }
    await ProductVariant.findOneAndRemove({ _id: doc.variantId });
    res.status(200).json({
      status: "success",
      message: "productVariant deleted"
    });
  } catch (e: any) {
    res.status(403).json({
      status: "failed",
      message: e.message
    });
  }
};

export const update_variant: RequestHandler = async (req: Request<{}, {}>, res) => {
  let doc = req.body;
  try {
    let pVariant = await ProductVariant.findByIdAndUpdate(
        doc.pVariantId, doc ,
        { new: true, useFindAndModify: false }
      )
    res.status(200).json({
      status: "success",
      data: pVariant
    });
  } catch (e: any) {
    res.status(403).json({
      status: "failed",
      message: e.message
    });
  }
};

const createSpecifications = async (doc: any, token: string) => {
  let response
  try {
    const DOMAIN_URL = accessEnv("DOMAIN_URL")
    const resp = await axios({
      method: 'post',
      url: `${DOMAIN_URL}/api/v1/specification/create`,
      data: doc,
      headers: {
        Authorization: token
      }})
    response = resp.data
  } catch (err: any) {
    response = err.response.data
  }
  return response
}

const validateCsvAndCreate = async (variant: any) => {
  const { categoryId, name } = variant;
  const cat = await Category.findOne({
    $or: [
      { _id: categoryId },
      { name}
    ],
  });

  if (cat) {
    return cat;
  } else {
    const variantDoc: any = { categoryId, name };
    let specifications = await Specification.find({categories: {$in: [categoryId]}});
    variantDoc.specifications = _.map(specifications, '_id');
    await ProductVariant.create(variantDoc);
  }
  return null
}


/*specDocs --->   [
  {
    productVariants: [],
    _id: 'CghdlGijxx73PdNSNTxLOhFph',
    categories: [ 'EG4paBmwFXh3UPXFubrs26m97' ],
    name: 'MPN',
    createdAt: '2021-10-08T06:06:11.395Z',
    updatedAt: '2021-10-08T06:06:11.395Z',
    isActive: true
  },
  {
    productVariants: [],
    _id: 'PXMxu6MvmQPWsLHiPiGNbrPJy',
    categories: [ 'EG4paBmwFXh3UPXFubrs26m97' ],
    name: 'Unlocked',
    createdAt: '2021-10-08T06:06:11.395Z',
    updatedAt: '2021-10-08T06:06:11.395Z',
    isActive: true
  },*/