import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();
const { v2: cloudinaryV2 } = cloudinary;

cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SCERET_KEY  // ensure the key is correct (typo in SCERET?)
});

const uploadImage = (file) => {
  return new Promise((resolve, reject) => {
  const stream = cloudinaryV2.uploader.upload_stream(
      { resource_type: 'image' },
      (error, result) => {
        if (error) {
          console.error('Cloudinary Upload Error:', error);
          reject(error);
        } else {
          resolve({
            url: result.secure_url,
            public_id: result.public_id
          });
        }
      }
    );

    stream.end(file.buffer);
  });
};
export { uploadImage };
