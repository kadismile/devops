import {Request, RequestHandler} from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../../middleware/request-middleware';
import Vendor from '../../models/Vendor';
import accessEnv from '../../helpers/accessEnv';
import axios from "axios"

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
  let doc = req.body
  try {
    let newUser: any = await createUser(doc)
    if (newUser?.data?._id) {
      req.body.phoneNumber = newUser.data.phoneNumber
      const vendor = new Vendor(req.body)
      await vendor.save();
      res.send({
        vendor: vendor.toJSON(),
        user: newUser
      });
    } else {
      res.status(403).json({
        status: "success",
        data: newUser.data
      });
    }
  } catch (e: any) {
    res.status(403).json({
      status: "failed",
      message: e.message
    });
  }
};

const createUser = async (doc: any) => {
  let response
  const data = {
    fullName: doc.businessName,
    password: doc.password,
    phoneNumber: doc.phoneNumber,
    userType: "vendor",
    email: doc.email,
    address: doc.businessAddress
  }
  try {
    const DOMAIN_URL = accessEnv("DOMAIN_URL")
    const resp = await axios.post(`${DOMAIN_URL}/api/v1/users/create`, data);
    response = resp.data
  } catch (err: any) {
    response = err.response
  }
  return response
}

export default requestMiddleware(create_vendor, { validation: { body: addVendorSchema } });
