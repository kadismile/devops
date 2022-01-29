import accessEnv from "./accessEnv";
import axios from "axios";

export const createOrderItems = async (doc: any) => {
  let response
  let items = {
    orderItems: doc.orderItems
  };
  try {
    const DOMAIN_URL = accessEnv("DOMAIN_URL")
    const resp = await axios({
      method: 'post',
      url: `${DOMAIN_URL}/api/v1/order/items/create`,
      data: items,
      headers: {
        Authorization: doc.token
      }
    });
    response = resp.data
  } catch (err: any) {
    response = err
    console.log("Response 111", response)
  }
  console.log("Response 222", response)
  return response.data
}