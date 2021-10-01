import { Model, Schema, model } from 'mongoose';
import mongoose from 'mongoose'
import TimeStampPlugin from './plugins/timestamp-plugin';
import accessEnv from '../helpers/accessEnv';
import {IProduct} from "../types";

interface IProductVariantModel extends Model<IProduct> { }
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
    required: [true, 'Please Add product type']
  },
  productType: {
    type: String,
    required: [true, 'Please Add product type']
  },
  categoryId: {
    type: String,
  },
  category: {
    type: String
  },
  status: {
    type: String,
    default: 'active',
    enum: ["active", "inactive"]
  },
  productImage: {
    type: String
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
},{versionKey: false});

// Add timestamp plugin for createdAt and updatedAt in miliseconds from epoch
schema.plugin(TimeStampPlugin);

const ProductVariant: IProductVariantModel = model<IProduct, IProductVariantModel>('ProductVariant', schema);

export default ProductVariant;