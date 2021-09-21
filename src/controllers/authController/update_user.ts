import { Request, RequestHandler } from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../../middleware/request-middleware';
import User from '../../models/User';
import prepareValidPhoneNumber from '../../helpers/prepareValidPhoneNumber';

export const updateUserSchema = Joi.object().keys({
  fullName: Joi.string(),
  phoneNumber: Joi.string(),
  email: Joi.string().email({ tlds: { allow: false } }),
  address: Joi.object({
    country: Joi.string(),
    phoneNumber: Joi.string(),
    fullAddress: Joi.string(),
    countryCode: Joi.string(),
    longitude: Joi.string(),
    latitude: Joi.string()
  }),
  //this user object below is sent down by the middleware
  //check auth middlware
  user: Joi.object()
});

const update_user: RequestHandler = async (req: Request<{}, {}>, res) => {
  const doc = req.body;
  if (doc.phoneNumber) {
    doc.phoneNumber = [prepareValidPhoneNumber(doc)];
  }
  const user = await User.findByIdAndUpdate(doc.user._id, doc, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  });

  res.status(200).json({
    status: "success",
    data: user
  });
};

export default requestMiddleware(update_user, { validation: { body: updateUserSchema } });