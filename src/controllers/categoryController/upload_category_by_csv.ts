import {Request, RequestHandler} from 'express';
import CSVToJSON from 'csvtojson'
import Category from "../../models/Category";
import * as fs from "fs";
import ApplicationError from '../../errors/application-error';


export const upload_category_by_csv: RequestHandler = async (req: Request<{}, {}>, res) => {
  try {
    let files: any = req.files;
    if (!files || files.length === 0) {
      throw new ApplicationError(`Kindly upload a csv file`, 403)
    }
    try {
      let categoryCsv =  await CSVToJSON().fromFile(`./attachments/csv/${files[0].originalname}`);
      let errors: any = [];
      if (categoryCsv.length) {
        for (const cat of categoryCsv) {
          const validation: any = await validateCsvAndCreate(cat);
          if (validation) {
            errors.push(validation);
          }
        }
        await fs.unlinkSync(`./attachments/csv/${files[0].originalname}`);
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
      data: 'category successfully uploaded via csv',
    });
  } catch (error: any) {
    res.status(500).json({ status: 'failed', message: error.message });
  }
};

async function validateCsvAndCreate(cat: any) {
  const category = await Category.findOne({ name: cat.name })
  if (category) {
    return category;
  } else {
    const newCategory = new Category(cat);
    await newCategory.save();
  }
  return null
}
