import { Request, RequestHandler } from 'express';
import CSVToJSON from 'csvtojson';
import * as fs from 'fs';
import ProductVariant from '../../models/ProductVariant';
import User from '../../models/User';
import Category from '../../models/Category';
import Vendor from '../../models/Vendor';
import ProductBrand from '../../models/ProductBrand';
import Product from '../../models/Product';


const upload_products_by_csv: RequestHandler = async (req: Request<{}, {}>, res) => {
  try {
    const files: any = req.files;
    if (!files || files.length === 0) {
      res.status(403).json({
        message: 'Kindly upload a csv file',
      });
    }
    try {
      let errors = [];
      const productCsv =  await CSVToJSON().fromFile(`./attachments/csv/${files[0].originalname}`);
      for (const product of productCsv) {
        const csvErrors: any = await validateCsv(product);
        console.log('csvErrors ----> ', csvErrors);
        if (csvErrors) {
          errors.push(csvErrors);
          res.status(200).json({
            status: 'error',
            data: errors,
          });
        } else {
          /*const newProduct: any = new Product(product);
          await newProduct.save();
          res.status(200).json({
            status: 'success',
            data: newProduct,
          });*/
        }
      }
      console.log('csvErrors ----> ', errors);
      await fs.unlinkSync(`./attachments/csv/${files[0].originalname}`)

    } catch (e) {
      res.status(403).json({
        error: e,
      });
    }
    res.status(200).json({
      status: 'success',
      data: 'product product successfully uploaded via csv',
    });
  } catch (error: any) {
    res.status(500).json({ status: 'failed', message: error.message });
  }
};

export async function validateCsv(product: any) {
  Promise.all([
    await ProductVariant.findOne({_id: product.productVariantId}),
    await User.findOne({_id: product.user}),
    await Vendor.findOne({_id: product.vendor}),
    await Category.findOne({_id: product.category}),
    await ProductBrand.findOne({_id: product.productBrand}),
   ]
  ).then((values) => {
    if (values.includes(null)) {
      return product;
    }
    return product;
  });

}

export default upload_products_by_csv
