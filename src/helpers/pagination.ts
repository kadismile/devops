import {Request} from "express";

export const paginate = async ( req: Request, model: any, populate: string)  => {
  const page = parseInt(<string>req.query.page, 10) || 1;
  const limit = parseInt(<string>req.query.limit, 10) || 0;
  const startIndex = (page - 1) * limit; //
  const endIndex = page * limit;
  const total = await model.countDocuments();

  const results = await model.find()
    .limit(limit)
    .skip( endIndex)
    .populate(populate)
  const pagination: any = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    }
  }

  if (startIndex > 0 ) {
    pagination.prev = {
      page: page -1,
      limit
    };
  }

  return {
    status: "success",
    count: results.length,
    pagination,
    data: results
  };

}