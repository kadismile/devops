import {Request, RequestHandler} from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../../middleware/request-middleware';
import OrderItem from "../../models/OrderItems";

export const orderSchema = Joi.object().keys({
  orderItems: Joi.array().items({
    vendorId: Joi.string().required(),
    userId: Joi.string().required(),
    productId: Joi.string().required(),
    category: Joi.string().required(),
    productBrand: Joi.string().required(),
    price: Joi.number().required(),
    attachments: Joi.array().items({
      url: Joi.string().required()
    }).required(),
  }).required(),
  user: Joi.object().required(),
});

const create_order_items: RequestHandler = async (req: Request<{}, {}>, res) => {
  let doc = req.body.orderItems
  doc.token = req.headers.authorization
  try {
      let items = await OrderItem.insertMany(doc)
      res.status(201).json({
        status: "success",
        data: {
          items: items
        }
      })
    } catch (e: any) {
    res.status(403).json({
      status: "failed",
      message: e.message
    });
  }
};

export default requestMiddleware(create_order_items, { validation: { body: orderSchema } });
