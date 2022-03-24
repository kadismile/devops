import { Request, RequestHandler } from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../../middleware/request-middleware';
import ProductVariant from '../../models/ProductVariant';
import accessEnv from '../../helpers/accessEnv';
import axios from 'axios';
import CSVToJSON from 'csvtojson';
import * as fs from 'fs';
import ApplicationError from '../../errors/application-error';
import _ from 'lodash';

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
      throw new ApplicationError(`Kindly upload a csv file`, 403)
    }
    try {
      const variantCsv =  await CSVToJSON().fromFile(`./attachments/csv/${files[0].originalname}`);
      let errors: any = [];
      if (variantCsv.length) {
        for (const variant of variantCsv) {
          const validation: any = await validateCsvAndCreate(variant);
          if (validation) {
            errors.push(validation);
          }
        }
        await fs.unlinkSync(`./attachments/csv/${files[0].originalname}`)
        if (errors.length) {
          res.status(403).json({
            status: 'failed',
            data: errors,
          });
        } else {
          res.status(201).json({
            status: 'success',
            data: 'category successfully uploaded via csv',
          });
        }
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
};

const validateCsvAndCreate = async (variant: any) => {
  const { categoryId, name, ...specifications } = variant;
  const pV: any = await ProductVariant.findOne({ name });
  variant.error = [];
  if (pV || _.isEmpty(specifications)) {
    variant.error.push( pV ? `Variant already exist` : 'Invalid CSV uploaded');
    return variant
  }

  let variantSpec: { [key: string] : any } = {}
  for (const spec in specifications) {
    const properties = specifications[spec]
    variantSpec[spec] = properties.split(",")
  }

  variant.specifications = variantSpec;
  const createdVariant = await ProductVariant.create(variant);
  if (!createdVariant) {
    variant.error.push("cannot create variant")
    return variant
  } else {
    return null
  }
};