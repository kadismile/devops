import requestMiddleware from '../../middleware/request-middleware';
import User from '../../models/User';
import Vendor from '../../models/Vendor';
import Joi from "@hapi/joi";
import {Request, RequestHandler} from "express"

export const LoginTokenSchema = Joi.object().keys({
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  loginToken: Joi.string().required(),
});

const loginToken: RequestHandler = async (req: Request<{}, {}>, res) => {
  let { email, loginToken } = req.body;
  const user: any =  await User.findOne({ email: email, loginToken: loginToken });
  if (user) {
    await User.findByIdAndUpdate(user._id, {
      loginToken: null
    }, {
      new: true,
      runValidators: true,
      useFindAndModify: false
    });
    const token = user.getSignedJwtToken();
    const vendor = await Vendor.findOne({user: user._id});
    res.status(200).json({
      status: "success",
      token,
      user: await User.findOne({ _id: user._id }),
      vendor: vendor ? vendor : undefined
    });

  } else {
    res.status(401).json({
      status: "failed",
      message: "User Not Found"
    });
  }
};

export default requestMiddleware(loginToken, { validation: { body: LoginTokenSchema } });