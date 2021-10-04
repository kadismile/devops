const cloudinary = require('cloudinary')
import accessEnv from '../helpers/accessEnv';


cloudinary.config({
  cloud_name: accessEnv("CLOUD_NAME"),
  api_key: accessEnv("CLOUDINARY_API_KEY"),
  api_secret: accessEnv("CLOUDINARY_API_SECRET", ""),
})



export const uploads = (file:any, folder:any) => {
  return new Promise( (resolve) => {
      cloudinary.uploader.upload(file, (result: any) => {
        return resolve({
          url: result.url,
          id: result.public_id
        })
      }, {
        resource_type: "auto",
        folder: folder
      })
  })
}
