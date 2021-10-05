import { Model, Schema, model } from 'mongoose';
import mongoose from 'mongoose'
import TimeStampPlugin from './plugins/timestamp-plugin';
import accessEnv from '../helpers/accessEnv';
import {IProduct, IUser} from "../types";

interface IProductModel extends Model<IProduct> { }
const schema = new Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'Please Add product name']
  },
  otherInformation: {
    type: String,
    required: [true, 'Please Add description']
  },
  productTypeId: {
    type: String,
    //required: [true, 'Please Add product type']
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
},{versionKey: false});

// Add timestamp plugin for createdAt and updatedAt in miliseconds from epoch
schema.plugin(TimeStampPlugin);

const Product: IProductModel = model<IProduct, IProductModel>('Product', schema);

export default Product;