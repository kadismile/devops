import { Model, Schema, model } from 'mongoose';
import TimeStampPlugin from './plugins/timestamp-plugin';
import {IProduct} from "../types";

interface IProductBrandModel extends Model<IProduct> { }
const schema = new Schema<IProduct>({
  name: {
    type: String,
    unique: true,
    required: [true, 'name is required']
  },
  productVariantId: {
    type: String,
    ref: 'ProductVariant'
  },
  isActive: {
    type: Boolean,
    default: function() {
      return true;
    }
  },
},{versionKey: false});

schema.plugin(TimeStampPlugin);

const ProductBrand: IProductBrandModel = model<IProduct, IProductBrandModel>('ProductBrand', schema);

export default ProductBrand;