import { Request, RequestHandler } from 'express';
import requestMiddleware from '@middleware/request-middleware';
import { advancedResults } from '../../helpers/advancedResults';
import User from '../../models/User';

const get_user: RequestHandler = async (req: Request, res) => {
  const doc = req.body;
  return res.status(200).send({
      status: "success",
      user: doc.user
  });
};

export const get_users: RequestHandler = async (req: Request, res) => {
  let users: any = await advancedResults(req, User, [""])
  if (users?.data) {
    res.status(200).json({
      status: "success",
      data: users
    });
  }
};

export default requestMiddleware(get_user);
