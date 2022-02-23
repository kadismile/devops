import requestMiddleware from '../../middleware/request-middleware';
import User from '../../models/User';
import Joi from "@hapi/joi";
import {Request, RequestHandler} from "express";

export const ChangePasswordSchema = Joi.object().keys({
  newPassword: Joi.string().required(),
  resetPasswordToken: Joi.string().required(),
  email: Joi.string().required()
});

const changePassword: RequestHandler = async (req: Request<{}, {}>, res) => {
  const { newPassword, resetPasswordToken, email } = req.body;
  const user: any =  await User.findOne({ resetPasswordToken: resetPasswordToken, email }).select('+password');
  if (user) {
    await User.findByIdAndUpdate(user._id, {
      resetPasswordToken: "null", password: newPassword }, {
      new: true,
      runValidators: true,
      useFindAndModify: false
    });
    res.status(200).json({
      status: "success",
      message: "Password Recovered Successfully"
    })
  } else {
    res.status(401).json({
      status: "failed",
      message: "No user found"
    });
  }
};

export const updatePassword: RequestHandler = async (req: Request<{}, {}>, res) => {
  let { email, newPassword, resetPasswordToken } = req.body;

  if (!resetPasswordToken) {
    const user: any =  await User.findOne({ email });
    if (user) {
      const token = "123456";
      await User.findByIdAndUpdate(user._id, {
        resetPasswordToken: token }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
      });
      res.status(200).json({
        status: "success",
        message: "A token as been sent to your email"
      })
    } else {
      res.status(401).json({
        status: "failed",
        message: "No user found"
      });
    }
  } else {
    const user: any =  await User.findOne({ resetPasswordToken: resetPasswordToken }).select('+password');
    if (user) {
      await User.findByIdAndUpdate(user._id, {
        resetPasswordToken: "null", password: newPassword }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
      });
      res.status(200).json({
        status: "success",
        message: "Password Updated Successfully"
      })
    } else {
      res.status(401).json({
        status: "failed",
        message: "No user found"
      });
    }
  }

};

export default requestMiddleware(changePassword, { validation: { body: ChangePasswordSchema } });