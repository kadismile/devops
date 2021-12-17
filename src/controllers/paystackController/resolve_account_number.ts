import {Request, RequestHandler} from "express";
import axios from 'axios'

const paystack_secret = process.env.PAYSTACK_SECRET;
const resolve_account_number: RequestHandler = async (req: Request, res) => {
  const {account_number, bank_code} = req.query;
  const baseUrl = "https://api.paystack.co";
  const config: any = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${paystack_secret}`
    }
  };
  try {
    const verify:any = await axios.get(`${baseUrl}/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`, config);
    return res.status(200).send({
      status: "success",
      data: verify.data.data
    });
  } catch (e:any) {
    return res.status(422).send(e.response.data);
  }
};

export default resolve_account_number;