import {Request, RequestHandler, response} from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../../middleware/request-middleware';
import {createOrderItems} from "../../helpers/createOrderItems";
import Order from '../../models/Order';
import User from '../../models/User';
import _ from 'lodash';
import Vendor from '../../models/Vendor';
import prepareValidPhoneNumber from '../../helpers/prepareValidPhoneNumber';

export const orderSchema = Joi.object().keys({
  userId: Joi.string().required(),
  vendorIds: Joi.array().required(),
  shippingAddress: Joi.object({
    country: Joi.string().required(),  
    countryCode: Joi.string().required(),  
    fullAddress: Joi.string().required(),
    email: Joi.string().required().email({ tlds: { allow: false } }),
    phoneNumber: Joi.string().required(),
  }).required(),
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

const create_order: RequestHandler = async (req: Request<{}, {}>, res) => {
  let doc = req.body
  doc.token = req.headers.authorization
  try {
    const orderItems: any = await createOrderItems(doc)
    const validate = await validateOrder(doc)
    const { status, user, phoneNumber, vendors } = validate
    if (status === 'failed') {
      return res.status(404).json({
        status: status,
        message: { user, phoneNumber, vendors }
      });
    }
    let order
    if (orderItems.items) {
      doc.shippingAddress.phoneNumber = phoneNumber
      let orderDoc = {
        userId: doc.userId,
        shippingAddress: doc.shippingAddress,
        orderItems: orderItems.items
      }
      order = new Order(orderDoc)
      await order.save();
    }
    res.status(201).json({
      status: "success",
      data: order
    });
  } catch (e: any) {
    res.status(403).json({
      status: "failed",
      message: e.message
    });
  }
};

const validateOrder = async (doc: any) => {
  let response: any = {}
  const uniqueVendorIds = _.uniq(doc.vendorIds)
  const user: any = await User.findById(doc.userId)
  const vendors: any = await Vendor.find({ _id: { $in: uniqueVendorIds } });
  const validPhoneNumber = prepareValidPhoneNumber(doc.shippingAddress)

  if (user?._id &&  (vendors?.length === uniqueVendorIds.length) && validPhoneNumber ) {
    response.status = 'success';
    response.phoneNumber = validPhoneNumber
  } else {
    response.status = 'failed';
    response.user = !user?._id ?`user cannot be found with _id ${doc.userId}`: undefined;
    response.vendors = !(vendors || vendors.length) ?`some vendors could be found within _id(s) ${uniqueVendorIds}` : undefined;
    response.phoneNumber = !validPhoneNumber ? `phone number ${doc.shippingAddress.phoneNumber}, is not valid` : undefined;
  }
  return response
}

export default requestMiddleware(create_order, { validation: { body: orderSchema } });
