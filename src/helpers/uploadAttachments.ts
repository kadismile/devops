import moment from 'moment';
import randomstring from 'randomstring';
import { uploads } from '../integrations/cloudinary';
import * as fs from 'fs';
import _ from 'lodash';
import Attachment from '../models/Attachment';

export const uploadAttachments = async (files: any, doc: any) => {
  let urls = [];
  let attachmentIds: any = [];
  for (const file of files) {
    const { path } = file;
    let newPath: any = await uploads(path, doc.model);
    if (newPath?.url) {
      urls.push({
        _id: randomstring.generate(25),
        url: newPath.url,
        collectionId: newPath.id,
        uploadedBy: doc.user,
        createdAt: moment().toISOString(),
        updatedAt: moment().toISOString(),
      });
      fs.unlinkSync(path);
    }
  }
  if (urls.length > 0) {
    let attachments = await Attachment.insertMany(urls);
    attachmentIds = _.map(attachments, '_id');
  }
  if (attachmentIds.length) return attachmentIds;
};
