import {Request, RequestHandler} from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../../middleware/request-middleware';
import Accounts from '../../models/Accounts';
import Vendor from '../../models/Vendor';

let accountSchema = Joi.object().keys({
  vendor: Joi.string().required(),
  user: Joi.object().required(),
  bank: Joi.object({
    bankName: Joi.string().required(),
    accountNumber: Joi.string().required(),
    bankCode: Joi.string().required(),
  }).required(),
});

let getAccountSchema = Joi.object().required().keys({
  vendorId: Joi.string().required(),
});

export const add_account_number: RequestHandler = async (req: Request<{}, {}>, res) => {
  let doc = req.body;
  try {
    const vendor: any = await Vendor.findById(doc.vendor);
    if (vendor) {

      const existingRecords = await Accounts.find({ vendor: vendor._id });
      const matchingRecord = _findMatchingRecord(existingRecords, doc.bank);

      if (matchingRecord) {
        res.status(201).json({
          status: "success",
          message: 'an existing account already exists',
          data: matchingRecord,
        });

      } else {
        doc.user = doc.user._id;
        doc.bank = [doc.bank];
        doc.requestPayload = JSON.stringify(doc.bank);
        const account = new Accounts(req.body);
        await account.save();
        if (account) {
          res.status(201).json({
            status: "success",
            message: 'account successfully added',
            data: account,
          });
        }
      }
    } else {
      res.status(403).json({
        status:'failed',
        message: 'vendor not found with'
      });
    }
  } catch (e: any) {
    res.status(403).json({
      status: "failed",
      message: e.message
    });
  }
};

export const vendor_account_numbers: RequestHandler = async (req: Request<{}, {}>, res) => {
  const doc = req.query;
  const vendor: any = await Vendor.findById(doc.vendorId);
  if (vendor) {
    const vendorAccounts = await Accounts.find({ vendor: vendor._id });
    if (vendorAccounts.length) {
      const accounts = vendorAccounts.map( (acc:any) => {
        const { bank } = acc;
        return {
          bankName: bank[0].bankName,
          accountNumber: bank[0].accountNumber
        }
      });

      res.status(200).json({
        status: "success",
        data: accounts
      });
    }
  } else {
    return res.status(404).json({
      status: "failed",
      message: 'vendor not found'
    });
  }
};

const _findMatchingRecord = (existingRecords:any, bankObject: {}) => {
  for (const record of existingRecords) {
    let requestPayload = JSON.parse(record.requestPayload);
    requestPayload = requestPayload[0];
    if (_matches(requestPayload, bankObject)) {
      return record
    }
  }
};

const _matches = (requestPayload: any, bankObject: any) => {
  const relevantAttrs = Object.keys(requestPayload);
  const existingRecord: any = {};
  const { bankName, accountNumber } = requestPayload;

  existingRecord.bankName = bankName;
  existingRecord.accountNumber = accountNumber;

  const attrMatches = relevantAttrs.map((attr: string) => {
    if (existingRecord[attr] === bankObject[attr]) {
      return true
    }
    if (existingRecord[attr] === undefined || bankObject[attr] === undefined) {
      return false
    }
    return existingRecord[attr].toString().toLowerCase() === bankObject[attr].toString().toLowerCase()
  });

  return attrMatches.every(entry => !!entry)
};

export const addAccountRequestHandler = requestMiddleware(add_account_number, { validation: { body: accountSchema } })
export const getAccountRequestHandler = requestMiddleware(vendor_account_numbers, { validation: { query: getAccountSchema } })

