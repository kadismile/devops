import { Request, RequestHandler } from 'express';
// @ts-ignore
import Joi from '@hapi/joi';
import requestMiddleware from '../../middleware/request-middleware';
import User from '../../models/User';
import prepareValidPhoneNumber from '../../helpers/prepareValidPhoneNumber';

export const addUserSchema = Joi.object().keys({
  fullName: Joi.string().required(),
  password: Joi.string().required(),
  phoneNumber: Joi.string().required(),
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
  doc.phoneNumber = [prepareValidPhoneNumber(doc)];
  const user = new User(req.body);
  await user.save();
  res.send({
    user: user.toJSON()
  });
};

export default requestMiddleware(create_user, { validation: { body: addUserSchema } });
