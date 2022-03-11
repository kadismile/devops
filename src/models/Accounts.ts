import { Model, Schema, model } from 'mongoose';
import TimeStampPlugin from './plugins/timestamp-plugin';
import {IAccount} from "../types";

interface IAccountModel extends Model<IAccount> { }
const schema = new Schema<IAccount>({
  bank: {
    type : Array,
    default : [],
  },
  primaryAccount: {
    type: Object,
    optional: true,
  },
  user: {
    type: String,
    ref: 'User',
    required: [true, 'A User is needed']
  },
  vendor: {
    type: String,
    ref: 'Vendor',
    required: [true, 'Please Add VendorId']
  },
  requestPayload: {
    type: String,
  },

},{versionKey: false});

// Add timestamp plugin for createdAt and updatedAt in milliseconds from epoch
schema.plugin(TimeStampPlugin);

const Accounts: IAccountModel = model<IAccount, IAccountModel>('Account', schema);

export default Accounts;