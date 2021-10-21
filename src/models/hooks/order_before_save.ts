import {IOrder} from '../../types';
import Order from "../Order";

const OrderBeforeSave = async (doc: IOrder) => {

  if (doc.orderItems.length > 0 && doc.userId) {
    doc.globalOrderNumber = await getNextGlobalNumber()
  }
  return doc
}

const getNextGlobalNumber = async () => {
  let order: any = await Order.findOne({}, {}, {sort: {createdAt: -1}});
  if (!order) {
    return 'GON-' + 1000;
  } else {
    let orderNumber = order.globalOrderNumber
    orderNumber = orderNumber.split('-')
    orderNumber = Number(orderNumber[1])
    return 'GON-' + (orderNumber += 1)
  }
}

export default OrderBeforeSave