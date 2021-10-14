import { Model, Schema, model } from 'mongoose';
import TimeStampPlugin from './plugins/timestamp-plugin';
import {IProduct} from "../types";

interface IProductTypeModel extends Model<IProduct> { }
const schema = new Schema<IProduct>({
  name: {
    type: String,
    unique: true,
    required: [true, 'name is required']
  },
  categoryId: {
    type: String,
    ref: 'Category',
    required: [true, 'kindly provide a category identifier']
  },
  productId: {
    type: String,
    ref: 'Product',
    required: false
  },
  specifications: [{
    type: String,
    ref: 'Specification',
    required: false,
  }],
  isActive: {
    type: Boolean,
    default: function() {
      return true;
    }
  },
},{versionKey: false});

// Add timestamp plugin for createdAt and updatedAt in miliseconds from epoch
schema.plugin(TimeStampPlugin);

const ProductVariant: IProductTypeModel = model<IProduct, IProductTypeModel>('ProductVariant', schema);

export default ProductVariant;