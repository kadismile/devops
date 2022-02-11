import { Model, Schema, model } from 'mongoose';
import TimeStampPlugin from './plugins/timestamp-plugin';
import {IProduct} from "../types";

interface IAdminProductModel extends Model<IProduct> { }
const schema = new Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'Please Add product name']
  },
  description: {
    type: String,
    required: [true, 'Please Add description']
  },
  productVariantId: {
    type: String,
    ref: 'ProductVariant',
    required: [true, 'Please Add productVariant Id']
  },
  price: {
    type: Number,
    required: [true, 'Please Add a price']
  },
  category: {
    type: String,
    ref: 'Category',
    required: [true, 'kindly provide a category identifier']
  },
  productBrand: {
    type: String,
    ref: 'ProductBrand',
    required: [true, 'kindly provide a product brand id']
  },
  specifications: {
    type: Array,
  },
  condition: {
    type : String,
    required: [true, 'Please Add a Condition']
  },
  isActive: {
    type: Boolean,
    default: function() {
      return true;
    }
  },
},{versionKey: false});

// Add timestamp plugin for createdAt and updatedAt in miliseconds from epoch
schema.plugin(TimeStampPlugin);

const AdminProduct: IAdminProductModel = model<IProduct, IAdminProductModel>('AdminProduct', schema);

export default AdminProduct;