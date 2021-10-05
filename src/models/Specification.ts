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
  categories: [{
    type: String,
    ref: 'Category'
  }],
},{versionKey: false});

schema.plugin(TimeStampPlugin);

const Specification: ISpecificationModel = model<IProduct, ISpecificationModel>('Specification', schema);

export default Specification;