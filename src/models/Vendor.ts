import { Model, Schema, model } from 'mongoose';
import TimeStampPlugin from './plugins/timestamp-plugin';
import { IVendor } from '../types';


interface IVendorModel extends Model<IVendor> { }

const schema = new Schema<IVendor>({
  businessName: {
    type: String,
    required: [true, 'Please Add Business Name']
  },
  email: {
    type: String,
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ],
    required: [true, 'Please Add Email']
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
    type: Object,
    optional: true,
  },
  businessAddress: {
    type : Object,
    required: [true, 'Please add an address']
  },
  businessOwner: {
    type : String,
    required: [true, 'Please add an business owner']
  },
  businessRegNumber: {
    type : String,
    required: [true, 'Please add a business reg number']
  },
  user: {
    type: String,
    ref: 'User',
    required: [true, "kindly provide a a userId"]
  },
  history: {
    type: Array,
    optional: true,
  },
  isActive: {
    type: Boolean,
    default : false,
  }
},{versionKey: false});

schema.plugin(TimeStampPlugin);

/*schema.pre('findOne', async function() {
  this.where({ isActive: true })
});

schema.pre('find', async function() {
  this.where({ isActive: true })
});*/


const Vendor: IVendorModel = model<IVendor, IVendorModel>('Vendor', schema);

export default Vendor;
