import User from '../models/User';

export const findUserByEmailOrPhone = async (phoneNumber:string, email:string) => {
  if (phoneNumber?.startsWith('0')) {
    phoneNumber = '+234' + phoneNumber.split('').splice(1).join('');
  }
  const user: any = await User.findOne({
    $or: [
      { email },
      { phoneNumber: { $in: phoneNumber } }],
  }).select('+password');
  if (!user) {
    return null;
  }
  return user;
}