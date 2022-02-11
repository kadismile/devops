import { Request, RequestHandler } from 'express';
import requestMiddleware from '@middleware/request-middleware';
import Category from "../../models/Category";
import {advancedResults} from "../../helpers/advancedResults";


const get_category: RequestHandler = async (req: Request, res) => {
  let category: any = await advancedResults(req, Category, ["specifications"])
  if (category?.data) {
    res.status(200).json({
      status: "success",
      data: category
    });
  }
};
export default requestMiddleware(get_category);
