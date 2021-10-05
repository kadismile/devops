 import accessEnv from '../helpers/accessEnv';
import ApplicationError from '../errors/application-error';
import User from '../models/User';
const jwt = require('jsonwebtoken');


const protect = async (req: any, res: any, next: any) => {
  try {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      next (new ApplicationError("Not authorized to access this route", 401))
    }
    try {
      const decoded = jwt.verify(token, accessEnv("JWT_SECRET"));
      const user = await User.findOne({ _id: decoded._id});
      if (!user) {
        next (new ApplicationError("Not authorized to access this route", 401))
      }
      req.body.user = await User.findOne({ _id: decoded._id});
      next();

    } catch (e) {
      // @ts-ignore
      next (new ApplicationError(e.message, 500))
    }
    // @ts-ignore
  } catch (err: any) {
    next(new ApplicationError(err.message, 500))
  }
};

export default protect


