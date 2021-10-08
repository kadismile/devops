import accessEnv from "./accessEnv";
import axios from "axios";

export const authenticateUser = async (doc: any) => {
  const { email, password } = doc
  let response
  try {
    const DOMAIN_URL = accessEnv("DOMAIN_URL")
    const resp = await axios({
      method: 'post',
      url: `${DOMAIN_URL}/api/v1/users/login`,
      data: { email, password }
    })
    response = resp.data
  } catch (err: any) {
    response = err.response.data
  }
  delete response?.status
  return response
}