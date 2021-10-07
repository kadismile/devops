import { Request, RequestHandler } from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../../middleware/request-middleware';
import User from '../../models/User';
import prepareValidPhoneNumber from '../../helpers/prepareValidPhoneNumber';
import kue from "kue";
import Mailer from "../../helpers/mailer";
import accessEnv from "../../helpers/accessEnv";
import axios from "axios";

export const addUserSchema = Joi.object().keys({
  fullName: Joi.string().required(),
  password: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  userType: Joi.string().valid(...['customer','vendor']).required(),
  email: Joi.string().required().email({ tlds: { allow: false } }),
  address: Joi.object({
    country: Joi.string().required(),
    fullAddress: Joi.string().required(),
    countryCode: Joi.string().required(),
    longitude: Joi.string().required(),
    latitude: Joi.string().required(),
  }).required(),
});

const create_user: RequestHandler = async (req: Request<{}, {}>, res) => {
  let doc = req.body
    try {
      doc.phoneNumber = [prepareValidPhoneNumber(doc)];
      const user = new User(req.body);
      await user.save();
      const queues = kue.createQueue();
      const type = "WelcomeEmailJob"
      queues
        .create(type, {
          email: user.email,
          fullName: user.fullName,
          subject: 'Welcome To Next-Handle',
        })
        .priority("high")
        .save();
      let loggedInUser
      if (user) {
        loggedInUser = await LoginUser(doc)
      }
      await Mailer.sendMail(type, 'welcome-email')
      res.send({
        status: "success",
        data: loggedInUser
      });
    } catch (e: any) {
      res.status(403).json({
        status: "failed",
        message: e.message
      });
    }
};

const LoginUser = async (doc: any) => {
  const { email, password } = doc
  let response
  try {
    const DOMAIN_URL = accessEnv("DOMAIN_URL")
    const resp = await axios({
      method: 'post',
      url: `${DOMAIN_URL}/api/v1/users/login`,
      data: { email, password }
    })
    response = resp.data
  } catch (err: any) {
    response = err.response.data
  }
  delete response?.status
  return response
}

export default requestMiddleware(create_user, { validation: { body: addUserSchema } });
