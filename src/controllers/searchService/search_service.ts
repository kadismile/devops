import {Request, RequestHandler} from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../../middleware/request-middleware';
import field from '../../utils/fields'
import accessEnv from "../../helpers/accessEnv";
const MongoClient = require('mongodb').MongoClient;

export const searchSchema = Joi.object().keys({
  searchTerm: Joi.string().required(),
  type: Joi.string().required(),
  query: Joi.object({
    limit: Joi.number()
  }).required(),
});

const search_service: RequestHandler = async (req: Request<{}, {}>, res) => {
  const MONGO_URL = accessEnv("MONGO_URL")
  const DATABASE_NAME = accessEnv("DATABASE_NAME")
  const client = new MongoClient(MONGO_URL, {
    useUnifiedTopology: true,
  });

  const doc = req.body
  let query = doc.query
  let type = doc.type
  let searchTerm = doc.searchTerm
  let limit: any = 50;
  if (query.limit ) {
    limit = parseInt(limit, 10);
    delete query.limit
  }

  try {
    await client.connect();
    const db = await client.db(DATABASE_NAME);
    const fields = field[type] || [];

    let method;
    if (!isPhone(searchTerm) && !(/^[a-zA-Z]+$/).test(String(Number(searchTerm))) || ifNumberSearch(searchTerm) ) {
      method = {
        near: {
          path: fields,
          origin: Number(searchTerm),
          "pivot": 2
        }
      };
    } else {
      method = {
        text: {
          query: searchTerm,
          path: fields,
          fuzzy: { maxEdits: 2, prefixLength: 2 },
          score: {boost: { value: 2 },},
        },
      }
    }

    res.status(200).json({
      status: "success",
      data: await db
        .collection(`${type}`)
        .aggregate([
          {
            '$search': {
              ...method
            }
          },
          { $match: query },
          {
            $limit: limit
          },
        ])
        .toArray()
    })

  } catch (error: any) {
    console.log("An error fetching", error.message);
  }
};

function isPhone(searchTerm: any) {
  return searchTerm.length > 10 && (/^[+]?[\s./0-9]*[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/g).test(searchTerm);
}

function ifNumberSearch(searchTerm: any) {
  return /^\d+$/.test(searchTerm)
}


export default requestMiddleware(search_service, { validation: { body: searchSchema } });
