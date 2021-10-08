import { Model, Schema, model } from 'mongoose';
import TimeStampPlugin from './plugins/timestamp-plugin';
import {IProduct} from "../types";

interface IConditionModel extends Model<IProduct> { }
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
  isActive: {
    type: Boolean,
    default: function() {
      return true;
    }
  },
},{versionKey: false});

schema.plugin(TimeStampPlugin);

const Condition: IConditionModel = model<IProduct, IConditionModel>('Condition', schema);

export default Condition;