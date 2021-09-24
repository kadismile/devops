import bcrypt from "bcryptjs";
import { IUser } from '../../types';
import User from '../User';
import ApplicationError from '../../errors/application-error';

const UserBeforeSave = async (doc: IUser ) => {
  const userByPhone: IUser | null = await User.findOne({ phoneNumber: { $in: doc.phoneNumber} });
  const userByEmail: IUser | null = await User.findOne({ email: doc.email })
  if (userByPhone)
    throw new ApplicationError(`User with phone-number ${doc.phoneNumber} already exist`, 406)
  if (userByEmail)
    throw new ApplicationError(`User with Email ${doc.email} already exist`, 406)

  if (doc.password) {
    const salt = await bcrypt.genSalt(10);
    doc.password = await bcrypt.hash(doc.password, salt);
  }

  if (doc.userType === "customer") {
    doc.customerNumber = await getNextSequenceValue()
  }
  return doc
}

const getNextSequenceValue = async () => {
  let user: any = await User.findOne({}, {}, {sort: { createdAt : -1 }});
  return user.customerNumber++;
}

export default UserBeforeSave