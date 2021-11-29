import accessEnv from "./accessEnv";
import axios from "axios";

export const createUser = async (doc: any) => {
  let response;
  const data = {
    fullName: doc.businessName,
    password: doc.password,
    phoneNumber: doc.phoneNumber,
    userType: "vendor",
    email: doc.email,
    address: doc.businessAddress
  };
  try {
    const DOMAIN_URL = accessEnv("DOMAIN_URL");
    const resp = await axios.post(`${DOMAIN_URL}/api/v1/users/create`, data);
    response = resp.data
  } catch (err: any) {
    response = err.response
  }
  return response.data
}