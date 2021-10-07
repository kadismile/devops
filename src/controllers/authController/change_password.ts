import requestMiddleware from '../../middleware/request-middleware';
import User from '../../models/User';
import Joi from "@hapi/joi";
import {Request, RequestHandler} from "express";
import {compare} from "bcryptjs";

export const ChangePasswordSchema = Joi.object().keys({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
  resetPasswordToken: Joi.string().required()
});

const changePassword: RequestHandler = async (req: Request<{}, {}>, res) => {
  let { oldPassword, newPassword, resetPasswordToken } = req.body;
  const user: any =  await User.findOne({ resetPasswordToken: resetPasswordToken }).select('+password')
  if (user) {
    let verify
    try {
      verify = await compare(oldPassword, user.password);
    } catch (e: any) {

    }
    if (!verify) {
      res.status(403).json({
        status: "failed",
        message: "Wrong Current Password Provided"
      });
    } else {
      await User.findByIdAndUpdate(user._id, {
        resetPasswordToken: "null", password: newPassword }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
      });
      res.status(200).json({
        status: "success",
        message: "Password Recovered Successfully"
      });
    }
  } else {
    res.status(401).json({
      status: "success",
      message: "No user found"
    });
  }
};

export default requestMiddleware(changePassword, { validation: { body: ChangePasswordSchema } });