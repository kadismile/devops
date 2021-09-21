import { ITimeStampedDocument } from './models/plugins/timestamp-plugin';

export interface IUser extends ITimeStampedDocument {
  name: string;
  email: string;
  fullName: string,
  phoneNumber: [string],
  userNumber: number,
  accountBalance: number,
  address: { phoneNumber: string, countryCode: string },
  password: string,
  resetPasswordToken: string,
  verifyEmailToken: string,
  roles: [string],
  history: [object],
  superAdmin: boolean
}