import {Request, RequestHandler} from 'express';
import CSVToJSON from 'csvtojson'
import requestMiddleware from '../../middleware/request-middleware';
import Category from "../../models/Category";
import * as fs from "fs";


export const upload_category_by_csv: RequestHandler = async (req: Request<{}, {}>, res) => {
  try {
    let files: any = req.files;
    console.log('--------------> we are here ')
    console.log("files -------> ", files)
    if (!files || files.length === 0) {
      res.status(403).json({
        message: 'Kindly upload a csv file',
      });
    }
    try {
      let categoryCsv =  await CSVToJSON().fromFile(`./attachments/csv/${files[0].originalname}`);
      for (const cat of categoryCsv) {
        await Category.create(cat)
      }
      await fs.unlinkSync(`./attachments/csv/${files[0].originalname}`)
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
