import { ITimeStampedDocument } from './models/plugins/timestamp-plugin';

export interface IUser extends ITimeStampedDocument {
  name: string;
  email: string;
  customerNumber: number,
  userType: string,
  fullName: string,
  phoneNumber: [string],
  userNumber: number,
  accountBalance: number,
  address: { phoneNumber: string, countryCode: string },
  businessAddress: { phoneNumber: string, countryCode: string },
  password: string,
  resetPasswordToken: string,
  verifyEmailToken: string,
  roles: [string],
  history: [object],
  superAdmin: boolean
}

export interface IVendor extends ITimeStampedDocument {
  businessName: string;
  email: string;
  vendorNumber: number,
  phoneNumber: [string],
  userNumber: number,
  accounts: object,
  isActive: boolean,
  history: [object],
  businessAddress: { phoneNumber: string, countryCode: string },
}