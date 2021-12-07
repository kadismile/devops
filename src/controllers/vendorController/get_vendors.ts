import { Request, RequestHandler } from 'express';
import Vendor from "../../models/Vendor";
import Joi from "@hapi/joi";
import { advancedResults } from '../../helpers/advancedResults'
import requestMiddleware from "@middleware/request-middleware";

export const productSchema = Joi.object().keys({
  vendorId: Joi.string(),
  user: Joi.object().required(),
});

const get_product: RequestHandler = async (req: Request, res) => {
  let vendors: any = await advancedResults(req, Vendor, undefined);
  if (vendors?.data) {
    res.status(200).json({
      status: "success",
      data: vendors
    });
  }
};
export default requestMiddleware(get_product);
