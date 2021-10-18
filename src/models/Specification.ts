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
  productVariants: [{
    type: String,
    ref: 'ProductVariant'
  }],
  isActive: {
    type: Boolean,
    default: function() {
      return true;
    }
  },
},{versionKey: false});

schema.plugin(TimeStampPlugin);

schema.pre('remove', function (next) {
  let specification = this;
  specification.model('Category').update(
    { specifications: specification._id },
    { $pull: { specifications: specification._id } },
    { multi: true },
    next);
});

const Specification: ISpecificationModel = model<IProduct, ISpecificationModel>('Specification', schema);

export default Specification;