import requestMiddleware from '../../middleware/request-middleware';
import User from '../../models/User';
import Joi from "@hapi/joi";
import {Request, RequestHandler} from "express";

export const ChangePasswordSchema = Joi.object().keys({
  newPassword: Joi.string().required(),
  resetPasswordToken: Joi.string().required()
});

const changePassword: RequestHandler = async (req: Request<{}, {}>, res) => {
  let { newPassword, resetPasswordToken } = req.body;
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
      message: "Password Recovered Successfully"
    })
  } else {
    res.status(401).json({
      status: "failed",
      message: "No user found"
    });
  }
};

export default requestMiddleware(changePassword, { validation: { body: ChangePasswordSchema } });