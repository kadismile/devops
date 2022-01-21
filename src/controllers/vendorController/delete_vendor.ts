import { Request, RequestHandler } from 'express';
import Vendor from "../../models/Vendor";
import Joi from "@hapi/joi";
import requestMiddleware from "@middleware/request-middleware";
import Product from "../../models/Product";

export const vendorSchema = Joi.object().keys({
  vendorId: Joi.string(),
  user: Joi.object().required(),
});

const delete_vendor: RequestHandler = async (req: Request, res) => {
  const { vendorId } = req.body;
  let vendor: any = await Vendor.findOne({ _id: vendorId });
  if (vendor) {
    await Vendor.findByIdAndUpdate(vendorId, { isActive: false }, {
      new: true,
      runValidators: true,
      useFindAndModify: false
    });
    await Product.updateMany(
      { vendor: vendorId },
      { $set: { isActive : false } },
      {multi: true}
    );
    res.status(200).json({
      status: "success",
      data: await Vendor.findOne({_id: vendorId})
    });
  } else {
    res.status(404).json({
      message: `vendor not found with ${vendorId}`,
    });
  }
};

export default requestMiddleware(delete_vendor, { validation: { body: vendorSchema } });
