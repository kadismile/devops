import { Request, RequestHandler } from 'express';
import Product from "../../models/Product";

const get_product: RequestHandler = async (req: Request, res) => {
  let product = await  Product.findById("JZREwCQyBQCHdcDpEosyN3DVp").populate("attachments")
  return res.status(200).send({
    data: product
  });
};
export default get_product;