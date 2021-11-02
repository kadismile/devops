import { Model, Schema, model } from 'mongoose';
import TimeStampPlugin from './plugins/timestamp-plugin';
import {IOrder} from "../types";
import OrderBeforeSave from "./hooks/order_before_save";

interface IOrderModel extends Model<IOrder> { }
const schema = new Schema<IOrder>({
  globalOrderNumber: {
    type: String,
    required: false
  },
  userId: {
    type: String,
    ref: 'User',
    required: [true, 'A User is needed']
  },
  subTotal: {
    type: Number,
    required: false
  },
  shippingAddress: {
    type : Object,
    required: [true, 'Please add an address']
  },
  orderItems: {
    type: Array,
    required: [true, 'Please Add items']
  },
  status: {
    type: String
  },
  shippingStatus: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: function() {
      return true;
    }
  },
},{versionKey: false});

// Add timestamp plugin for createdAt and updatedAt in milliseconds from epoch
schema.plugin(TimeStampPlugin);

schema.pre("save", async function(this, next) {
  await OrderBeforeSave(this)
});

const Order: IOrderModel = model<IOrder, IOrderModel>('Order', schema);

export default Order;