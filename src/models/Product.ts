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
  description: {
    type: String,
    required: [true, 'Please Add description']
  },
  productTypeId: {
    type: String,
    //required: [true, 'Please Add product type']
  },
  productType: {
    type: String,
    //required: [true, 'Please Add product type']
  },
  categoryId: {
    type: String,
  },
  category: {
    type: String
  },
  productImage: {
    type: String
  },
  productVariant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductVariant'
  }
},{versionKey: false});

// Add timestamp plugin for createdAt and updatedAt in miliseconds from epoch
schema.plugin(TimeStampPlugin);

const Product: IProductModel = model<IProduct, IProductModel>('Product', schema);

export default Product;