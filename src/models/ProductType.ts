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
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
},{versionKey: false});

// Add timestamp plugin for createdAt and updatedAt in miliseconds from epoch
schema.plugin(TimeStampPlugin);

const ProductType: IProductTypeModel = model<IProduct, IProductTypeModel>('ProductType', schema);

export default ProductType;