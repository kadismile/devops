import { Request, RequestHandler } from 'express';
import CSVToJSON from 'csvtojson';
import * as fs from 'fs';
import ProductVariant from '../../models/ProductVariant';
import Category from '../../models/Category';
import ProductBrand from '../../models/ProductBrand';
import AdminProduct from '../../models/AdminProduct';


const upload_products_by_csv: RequestHandler = async (req: Request<{}, {}>, res) => {
  try {
    const files: any = req.files;
    if (!files || !files.length) {
      res.status(403).json({
        message: 'Kindly upload a csv file',
      });
    }
    try {
      const productCsv =  await CSVToJSON().fromFile(`./attachments/csv/${files[0].originalname}`);
      let errors: any = [];
      for (const product of productCsv) {
        const validation: any = await validateCsvAndCreate(product);
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
          data: 'product successfully uploaded via csv',
        });
      }
    } catch (e: any) {
      res.status(403).json({
        error: e,
        status: 'failed',
        message: e.message
      });
    }
  } catch (error: any) {
    res.status(500).json({ status: 'failed', message: error.message });
  }
};

export async function validateCsvAndCreate(product: any) {
  let values: any = await Promise.all([
    await ProductVariant.findOne({_id: product.productVariantId}),
    await Category.findOne({_id: product.category}),
    await ProductBrand.findOne({_id: product.productBrand}),
   ]);

  if (values.includes(null)) {
    return product;
  } else {
    const adminProduct = new AdminProduct(product);
    await adminProduct.save();
  }
  return null
}

export default upload_products_by_csv
