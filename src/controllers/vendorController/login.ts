import { Request, RequestHandler } from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../../middleware/request-middleware';
import User from '../../models/User';
import ApplicationError from '../../errors/application-error';
import kue from "kue";
import Mailer from "../../helpers/mailer";
import Vendor from "../../models/Vendor";
import { authenticateUser } from '../../helpers/authenticateUser';

export const LoginSchema = Joi.object().keys({
  password: Joi.string().required(),
  phoneNumber: Joi.string(),
  email: Joi.string().email({ tlds: { allow: false } }),
});

const login: RequestHandler = async (req: Request<{}, {}>, res) => {
  const auth = await authenticateUser(req.body);
  const vendor = await Vendor.findOne({ user: auth._id });
  if (vendor) {
    res.status(200).json({
      status: "success",
      token: auth.token,
      user: auth.user,
      vendor
    });
  } else {
    res.status(401).json({
      status: "failed",
      data: "Invalid credentials"
    });
  }

};

export default requestMiddleware(login, { validation: { body: LoginSchema } });