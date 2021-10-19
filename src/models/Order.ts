import { Model, Schema, model } from 'mongoose';
import TimeStampPlugin from './plugins/timestamp-plugin';
import {IOrder} from "../types";

interface IOrderModel extends Model<IOrder> { }
const schema = new Schema<IOrder>({
  globalOrderNumber: {
    type: String,
    required: [true, 'Please Add globalOrderNumber']
  },
  userId: {
    type: String,
    ref: 'User',
    required: [true, 'A User is needed']
  },
  subTotal: {
    type: Number,
    required: [true, 'Please Add a price']
  },
  shippingAddress: {
    type : Object,
    required: [true, 'Please add an address']
  },
  items: [{
    type: String,
    ref: 'OrderItems',
    required: [true, 'Please Add items']
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

const Order: IOrderModel = model<IOrder, IOrderModel>('Order', schema);

export default Order;