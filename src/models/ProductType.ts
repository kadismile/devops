import { Model, Schema, model } from 'mongoose';
import mongoose from 'mongoose'
import TimeStampPlugin from './plugins/timestamp-plugin';
import accessEnv from '../helpers/accessEnv';
import {IProduct} from "../types";

interface IProductTypeModel extends Model<IProduct> { }
const schema = new Schema<IProduct>({
  name: {
    type: String,
    unique: true,
    required: [true, 'name is required']
  },
  product: {
    type: String,
    ref: 'Product',
    required: [true, 'kindly provide a product identifier']
  },
},{versionKey: false});

// Add timestamp plugin for createdAt and updatedAt in miliseconds from epoch
schema.plugin(TimeStampPlugin);

const ProductType: IProductTypeModel = model<IProduct, IProductTypeModel>('ProductType', schema);

export default ProductType;