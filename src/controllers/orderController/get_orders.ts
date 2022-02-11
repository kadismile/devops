import { Request, RequestHandler } from 'express';
import requestMiddleware from '@middleware/request-middleware';
import Order from "../../models/Order";
import {advancedResults} from "../../helpers/advancedResults";


const get_Order: RequestHandler = async (req: Request, res) => {
  let order: any = await advancedResults(req, Order, ["specifications"])
  if (order?.data) {
    res.status(200).json({
      status: "success",
      data: order
    });
  }
};
export default requestMiddleware(get_Order);
