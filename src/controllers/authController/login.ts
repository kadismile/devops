import { Request, RequestHandler } from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../../middleware/request-middleware';
import User from '../../models/User';
import ApplicationError from '../../errors/application-error';
import kue from "kue";
import Mailer from "../../helpers/mailer";
import Vendor from "../../models/Vendor";

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
      if (isAdmin && !user.isAdmin && user.isAdmin === false) {
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
        const vendor = await Vendor.findOne({user: user._id});
        res.status(200).json({
          status: "success",
          token,
          user: await User.findOne({ _id: user._id }),
          vendor: vendor ? vendor : undefined
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