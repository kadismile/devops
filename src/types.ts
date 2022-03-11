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
  superAdmin: boolean,
  isActive: boolean,
  isVerified: boolean,
  countryCode: string
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

export interface IProduct extends ITimeStampedDocument {
  name: string,
  description: string,
  productTypeId: string,
  productType: string,
  categoryId: string,
  category: string,
  status: string,
  productImage: string
  uploadedAt: string
}

export interface IOrder extends ITimeStampedDocument {
  globalOrderNumber: string,
  userId: string,
  subTotal: number,
  shippingAddress: string,
  orderItems: [string],
  vendorId: string,
  category: string,
  productBrand: string,
  name: string,
  price: number,
  attachments: [string]
}

export interface IAccount extends ITimeStampedDocument {
  bank: [object],
  primaryAccount: object,
  user: string,
  vendor: string,
  history: [object]
}