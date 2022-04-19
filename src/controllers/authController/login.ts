import { Request, RequestHandler } from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../../middleware/request-middleware';
import User from '../../models/User';
import ApplicationError from '../../errors/application-error';
import kue from "kue";
import Mailer from "../../helpers/mailer";
import Vendor from "../../models/Vendor";
import { findUserByEmailOrPhone } from '../../helpers/userHelper';

export const LoginSchema = Joi.object().keys({
  password: Joi.string().required(),
  phoneNumber: Joi.string(),
  isAdmin: Joi.boolean(),
  email: Joi.string().email({ tlds: { allow: false } }),
});

const login: RequestHandler = async (req: Request<{}, {}>, res) => {
  let { email, phoneNumber, password, isAdmin } = req.body;
  if (!email && !phoneNumber) {
    res.status(400).json({
      status: "failed",
      error: "Please Login with  your phone-number or email"
    });
  }

  if (phoneNumber || email) {
    try {
      const user:any = await findUserByEmailOrPhone(phoneNumber, email);
      const vendor:any = await Vendor.findOne({ user: user._id });
      if (vendor || !user) {
        res.status(401).json({
          data: "this user is not currently registered"
        });
      }
      if (isAdmin && !user.isAdmin && user.isAdmin === false) {
        res.status(401).json({
          data: "this user is not currently registered"
        });
      }
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        res.status(401).json({
          status: "failed",
          data: "this user is not currently registered"
        });
      } else {
        const token = user.getSignedJwtToken();
        delete user.password;
        res.status(200).json({
          status: "success",
          token,
          user
        });
        /*if (!user.loginToken) {
          const loginToken = Math.floor(1000 + Math.random() * 900000);
          await User.findByIdAndUpdate(user._id, {loginToken}, {
            new: true,
            runValidators: true,
            useFindAndModify: false
          });
          const queues = kue.createQueue();
          const type = "LoginTokenJob"
          queues
            .create(type, {
              loginToken,
              name: user.fullName,
              email: user.email,
              subject: 'Your Login Token',
            })
            .priority("high")
            .save();
          await Mailer.sendMail(type, 'login-token')
          res.status(200).json({
            status: "success",
            email: user.email,
            message: "kindly enter the token sent to your registered email address"
          });
        } else {
          res.status(200).json({
            persistent: true,
            status: "success",
            email: user.email,
            message: "Login token has already been sent to your registered email address"
          });
        }*/
      }
    } catch (e: any) {
      throw new ApplicationError(e.message, 500)
    }
  }

};

export default requestMiddleware(login, { validation: { body: LoginSchema } });