import { Request, RequestHandler } from 'express';
import axios from 'axios';

const get_banks: RequestHandler = async (req: Request, res) => {
  const baseUrl = "https://api.paystack.co";
  const config: any = {
    method: 'GET',
    headers: {Accept: 'application/json', 'User-Agent': 'Paystack-Developers-Hub'}
  };
  const banks = await axios.get(`${baseUrl}/bank?perPage=50&page=1`, config);
  return res.status(200).send({
    status: "success",
    data: banks.data.data
  });
};


export default get_banks;
