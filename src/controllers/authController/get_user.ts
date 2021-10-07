import { Request, RequestHandler } from 'express';
import requestMiddleware from '@middleware/request-middleware';

const get_user: RequestHandler = async (req: Request, res) => {
  let doc = req.body
  return res.status(200).send({
      status: "success",
      user: doc.user
  }
  );
};

export default requestMiddleware(get_user);
