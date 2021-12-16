import axios from 'axios'
import {error} from "winston";
interface IUser {
  token?: string,
  name?: string,
  email?: string,
  password?: string
}

class Paystack {
  public baseUrl = "https://api.paystack.co/";

  async listBanks() {
    const options = {
      method: 'GET',
      headers: {Accept: 'application/json', 'User-Agent': 'Paystack-Developers-Hub'}
    };
    return window
      .fetch(`${this.baseUrl}/bank?perPage=50&page=1`, options)
      .then(async response => {
        return await response.json()
      }).catch((err)=>{
        console.log("error", err)
    })
  }
}

export default new Paystack();