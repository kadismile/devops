import { IUser } from '../types';

const PNF = require('google-libphonenumber').PhoneNumberFormat;
const PhoneNumberUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
import ApplicationError from '../errors/application-error';


const prepareValidPhoneNumber = (doc: IUser) =>{
  if (!isValidPhoneNumber(doc)) {
    throw new ApplicationError(`An invalid phone number ${doc.phoneNumber} was provided`, 406)
  }
  return preparePhoneNumber(doc);
};

const preparePhoneNumber = (doc: IUser) => {
  const phoneUtil = PhoneNumberUtil;
  const phone = phoneUtil.parse(doc.phoneNumber, doc.address.countryCode);
  if (phoneUtil.isValidNumber(phone)) {
    return phoneUtil.format(phone, PNF.E164)
  } else {
    return false
  }
}

const isValidPhoneNumber = (doc: IUser) => {
  const phoneUtil = PhoneNumberUtil;
  const phone = phoneUtil.parse(doc.phoneNumber, doc.address.countryCode);
  return phoneUtil.isValidNumber(phone);
}

export default prepareValidPhoneNumber