import { Model, Schema, model } from 'mongoose';
import TimeStampPlugin from './plugins/timestamp-plugin';
import {IProduct, IUser} from "../types";

interface IProductModel extends Model<IProduct> { }
const schema = new Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'Please Add product name']
  },
  description: {
    type: String,
    required: [true, 'Please Add description']
  },
  productVariantId: {
    type: String,
    ref: 'ProductVariant'
  },
  productType: {
    type: String,
    required: [true, 'Please Add product type']
  },
  price: {
    type: Number,
  },
  user: {
    type: String,
    ref: 'User'
  },
  vendor: {
    type: String,
    ref: 'Vendor'
  },
  attachments: [{
    type: String,
    ref: 'Attachment',
    required: [true, 'kindly provide attachments identifier']
  }],
  category: {
    type: String,
    ref: 'Category',
    required: [true, 'kindly provide a category identifier']
  },
  specifications: {
    type : Array,
    default : [],
  },
  conditions: {
    type : Array,
    default : [],
  },
  specialOffer: {
    type: Boolean
  },
  specialOfferPercentage: {
    type: Number,
  },
  inSale: {
    type: Boolean,
    required: true
  },
  isActive: {
    type: Boolean,
    default: function() {
      return true;
    }
  },
},{versionKey: false});

// Add timestamp plugin for createdAt and updatedAt in miliseconds from epoch
schema.plugin(TimeStampPlugin);

const Product: IProductModel = model<IProduct, IProductModel>('Product', schema);

export default Product;