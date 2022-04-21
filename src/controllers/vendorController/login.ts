import { Request, RequestHandler } from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../../middleware/request-middleware';
import User from '../../models/User';
import ApplicationError from '../../errors/application-error';
import kue from "kue";
import Mailer from "../../helpers/mailer";
import Vendor from "../../models/Vendor";
import { authenticateUser } from '../../helpers/authenticateUser';
import { findUserByEmailOrPhone } from '../../helpers/userHelper';

export const LoginSchema = Joi.object().keys({
  password: Joi.string().required(),
  phoneNumber: Joi.string(),
  email: Joi.string().email({ tlds: { allow: false } }),
});

const login: RequestHandler = async (req: Request<{}, {}>, res) => {
  let { email, phoneNumber, password } = req.body;
  if (phoneNumber || email) {
    try {
      const user:any = await findUserByEmailOrPhone(phoneNumber, email);
      const vendor: any = await Vendor.findOne({ user: user._id })
      const isMatch = await user.matchPassword(password);
      if (!isMatch || !vendor) {
        res.status(401).json({
          status: "failed",
          data: "this vendor is not currently registered"
        });
      } else {
        const token = user.getSignedJwtToken();
        delete user.password;
        res.status(200).json({
          status: "success",
          token,
          vendor: await Vendor.findOne({ user: user._id })
        });
      }
    } catch (e: any) {
      throw new ApplicationError(e.message, 500)
    }
  }
};

export default requestMiddleware(login, { validation: { body: LoginSchema } });