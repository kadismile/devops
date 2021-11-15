import { Model, Schema, model } from 'mongoose';
import TimeStampPlugin from './plugins/timestamp-plugin';
import {IProduct, IUser} from "../types";

interface IAttachmentModel extends Model<IProduct> { }
const schema = new Schema<IProduct>({
  uploadedBy: {
    type: String,
    ref: 'User'
  },
  url: {
    type: String,
  },
  collectionId: {
    type: String,
  },
},{versionKey: false});

schema.plugin(TimeStampPlugin);


const Attachment: IAttachmentModel = model<IProduct, IAttachmentModel>('Attachment', schema);

export default Attachment;