import { Request, RequestHandler } from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../../middleware/request-middleware';
import User from '../../models/User';
import prepareValidPhoneNumber from '../../helpers/prepareValidPhoneNumber';
import ApplicationError from "../../errors/application-error";

export const addUserSchema = Joi.object().keys({
  fullName: Joi.string().required(),
  password: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  userType: Joi.string().valid(...['customer','vendor']).required(),
  email: Joi.string().required().email({ tlds: { allow: false } }),
  address: Joi.object({
    country: Joi.string().required(),
    fullAddress: Joi.string().required(),
    countryCode: Joi.string().required(),
    longitude: Joi.string().required(),
    latitude: Joi.string().required(),
  }).required(),
});

const create_user: RequestHandler = async (req: Request<{}, {}>, res) => {
  let doc = req.body
    try {
      doc.phoneNumber = [prepareValidPhoneNumber(doc)];
      const user = new User(req.body);
      await user.save();
      res.send({
        data: user.toJSON()
      });
    } catch (e: any) {
      res.status(403).json({
        status: "failed",
        message: e.message
      });
    }
};

export default requestMiddleware(create_user, { validation: { body: addUserSchema } });
