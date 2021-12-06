import requestMiddleware from '../../middleware/request-middleware';
import User from '../../models/User';
import  Mailer from '../../helpers/mailer'
import accessEnv from '../../helpers/accessEnv';
import Joi from "@hapi/joi";
import {Request, RequestHandler} from "express";
import kue from "kue";

export const RecoverPasswordSchema = Joi.object().keys({
  email: Joi.string().email({ tlds: { allow: false } }),
});

const recoverPassword: RequestHandler = async (req: Request<{}, {}>, res) => {
  let { email } = req.body;
  const user: any =  await User.findOne({ email: email })
  if (user) {
    const resetPasswordToken = user.getSignedJwtToken("1h");
    await User.findByIdAndUpdate(user._id, {
      resetPasswordToken
    }, {
      new: true,
      runValidators: true,
      useFindAndModify: false
    });

    const DOMAIN_URL = accessEnv("DOMAIN_URL", "")
    const resetPasswordUrl = DOMAIN_URL+'/reset-password-token/'+resetPasswordToken

    const queues = kue.createQueue();
    const type = "forgotEmailPasswordJob"
    queues
      .create(type, {
        email: user.email,
        subject: 'Password Reset',
        resetPasswordUrl
      })
      .priority("high")
      .save();
    await Mailer.sendMail(type, 'password-reset')
    res.status(200).json({
      status: "success",
      message: `Password Recovery Email Sent To ${email}`
    });

  } else {
    res.status(401).json({
      status: "failed",
      message: "No user found With That Email"
    });
  }
};

export default requestMiddleware(recoverPassword, { validation: { body: RecoverPasswordSchema } });