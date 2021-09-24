import { Model, Schema, model } from 'mongoose';
import TimeStampPlugin from './plugins/timestamp-plugin';
import { IUser } from '../types';


interface IVendorModel extends Model<IUser> { }

const schema = new Schema<IUser>({
  businessName: {
    type: String,
    required: [true, 'Please Add Business Name']
  },
  phoneNumber: {
    type : Array,
    default : [],
  },
  vendorNumber: {
    type: Number,
    optional: true,
  },
  accounts: {
    type: Number,
    default: function() {
      return 0.0;
    }
  },
  businessAddress: {
    type : String,
    required: [true, 'Please add an address to your business']
  },
  history: {
    type: Array,
    optional: true,
  },
},{versionKey: false});

schema.plugin(TimeStampPlugin);


const Vendor: IVendorModel = model<IUser, IVendorModel>('Vendor', schema);

export default Vendor;
