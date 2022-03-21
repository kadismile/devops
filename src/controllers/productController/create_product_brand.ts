import {Request, RequestHandler} from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../../middleware/request-middleware';
import ProductBrand from '../../models/ProductBrand';
import CSVToJSON from "csvtojson";
import Category from "../../models/Category";
import * as fs from "fs";

export const productBrandSchema = Joi.object().keys({
  name: Joi.string().required(),
  productVariantId: Joi.string().required()
});

const create_product_brand: RequestHandler = async (req: Request<{}, {}>, res) => {
  let doc = req.body
  try {
   let prodBrand = new ProductBrand(doc);
    await prodBrand.save()
    res.status(201).json({
      status: "success",
      data: prodBrand
    });
  } catch (e: any) {
    res.status(403).json({
      status: "failed",
      message: e.message
    });
  }
};

export default requestMiddleware(create_product_brand, { validation: { body: productBrandSchema } });

export const delete_product_brand: RequestHandler = async (req: Request<{}, {}>, res) => {
  let doc = req.body
  try {
    let category = await ProductBrand.findOne({ _id: doc.brandId })
    if (!category) {
      res.status(404).json({
        status: "failed",
        message: "brand not found"
      });
    }
    await ProductBrand.findOneAndRemove({ _id: doc.brandId });
    res.status(200).json({
      status: "success",
      message: "category deleted"
    });
  } catch (e: any) {
    res.status(403).json({
      status: "failed",
      message: e.message
    });
  }
};

export const upload_brand_by_csv: RequestHandler = async (req: Request<{}, {}>, res) => {
  try {
    let files: any = req.files;
    if (!files || !files.length) {
      res.status(403).json({
        message: 'Kindly upload a csv file',
      });
    }
    try {
      let brandCsv =  await CSVToJSON().fromFile(`./attachments/csv/${files[0].originalname}`);
      let errors: any = [];
      if (brandCsv.length) {
        for (const proBrand of brandCsv) {
          const validation: any = await validateCsvAndCreate(proBrand);
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
            data: 'product brand successfully uploaded via csv',
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
      data: 'brand(s) successfully uploaded via csv',
    });
  } catch (error: any) {
    res.status(500).json({ status: 'failed', message: error.message });
  }
};

const  validateCsvAndCreate = async (proBrand: any) => {
  const pBrand = await ProductBrand.findOne({ name: proBrand.name })
  if (pBrand) {
    return pBrand;
  } else {
    const newPbrand = new Category(proBrand);
    await newPbrand.save();
  }
  return null
}
