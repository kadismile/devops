import { Model, Schema, model } from 'mongoose';
import TimeStampPlugin from './plugins/timestamp-plugin';
import {IOrder} from "../types";

interface OrderItemsModel extends Model<IOrder> { }

const schema = new Schema<IOrder>({
  vendorId: {
    type: String,
    required: [true, 'Please Add vendorId']
  },
  productId: {
    type: String,
    required: [true, 'Please Add productId']
  },
  category: {
    type: String,
    required: [true, 'Please Add category']
  },
  productBrand: {
    type: String,
    required: [true, 'Please Add productBrand']
  },
  name: {
    type: String,
    required: [true, 'Please Add product name']
  },
  price: {
    type: Number,
    required: [true, 'Please Add a price']
  },
  description: {
    type: String,
    required: [true, 'Please Add a price']
  },
  attachments: [{
    type : Array,
    default : [],
  }],
},{versionKey: false});

// Add timestamp plugin for createdAt and updatedAt in miliseconds from epoch
schema.plugin(TimeStampPlugin);

const OrderItem: OrderItemsModel = model<IOrder, OrderItemsModel>('OrderItem', schema);

export default OrderItem;