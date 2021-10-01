import { Model, Schema, model } from 'mongoose';
import TimeStampPlugin from './plugins/timestamp-plugin';
import {IProduct} from "../types";

interface ICategoryModel extends Model<IProduct> { }
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

schema.plugin(TimeStampPlugin);

const Category: ICategoryModel = model<IProduct, ICategoryModel>('Category', schema);

export default Category;