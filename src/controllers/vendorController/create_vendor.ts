import {Request, RequestHandler} from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../../middleware/request-middleware';
import Vendor from '../../models/Vendor';
import { createUser } from '../../helpers/createUser'
import User from "../../models/User";

export const addVendorSchema = Joi.object().keys({
  businessName: Joi.string().required(),
  password: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  email: Joi.string().required().email({ tlds: { allow: false } }),
  businessAddress: Joi.object({
    country: Joi.string().required(),
    fullAddress: Joi.string().required(),
    countryCode: Joi.string().required(),
    longitude: Joi.string().required(),
    latitude: Joi.string().required(),
  }).required(),
});

const create_vendor: RequestHandler = async (req: Request<{}, {}>, res) => {
  let doc = req.body;
  try {
    let newUser: any = await createUser(doc);
    if (newUser.status === 'failed') {
      res.status(403).json({
        status: newUser.status,
        message: newUser.message
      });
    }
    if (newUser.email) {
      newUser = await User.findOne({ email: newUser.email });
      req.body.phoneNumber = newUser.phoneNumber;
      req.body.user = newUser._id;
      const vendor = new Vendor(req.body);
      await vendor.save();
      res.status(201).json({
        status: "success",
        data: {
          vendor: vendor.toJSON(),
          user: newUser
        }
      });
    }
  } catch (e: any) {
    res.status(403).json({
      status: "failed",
      message: e.message
    });
  }
};
export default requestMiddleware(create_vendor, { validation: { body: addVendorSchema } });
