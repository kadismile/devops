import { Request, RequestHandler } from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../../middleware/request-middleware';
import User from '../../models/User';
import ApplicationError from '../../errors/application-error';

export const LoginSchema = Joi.object().keys({
  password: Joi.string().required(),
  phoneNumber: Joi.string(),
  email: Joi.string().email({ tlds: { allow: false } }),
});

const login: RequestHandler = async (req: Request<{}, {}>, res) => {
  let { email, phoneNumber, password } = req.body;
  if (!email && !phoneNumber) {
    res.status(403).json({
      status: "failed",
      error: "Please Login with  your phone-number or email"
    });
  }
  if (phoneNumber || email) {
    try {
      if (phoneNumber?.startsWith("0")) {
        phoneNumber = "+234" + phoneNumber.split("").splice(1).join("")
      }
      const user: any = await User.findOne( { $or:[
          { email },
          { phoneNumber: { $in: phoneNumber} } ] })
          .select('+password');
      if (!user) {
        res.status(401).json({
          data: "Invalid credentials"
        });
      }
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        res.status(401).json({
          status: "failed",
          data: "Invalid credentials"
        });
      } else {
        const token = user.getSignedJwtToken();
        res.status(201).json({
          status: "success",
          token,
          user
        });
      }
    } catch (e: any) {
      throw new ApplicationError(e.message, 500)
    }
  }
};

export default requestMiddleware(login, { validation: { body: LoginSchema } });