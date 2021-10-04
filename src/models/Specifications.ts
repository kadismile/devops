import { Model, Schema, model } from 'mongoose';
import TimeStampPlugin from './plugins/timestamp-plugin';
import {IProduct} from "../types";

interface ISpecificationModel extends Model<IProduct> { }
const schema = new Schema<IProduct>({
  name: {
    type: String,
    unique: true,
    required: [true, 'name is required']
  },
  category: {
    type: String,
    ref: 'Category'
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

const Specification: ISpecificationModel = model<IProduct, ISpecificationModel>('Specification', schema);

export default Specification;