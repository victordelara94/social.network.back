import 'dotenv/config';
export const clusterSubdomain = process.env.DB_CLUSTER;
export const user = process.env.DB_USER;
export const password = process.env.DB_PASSWORD;
export const token = process.env.TOKEN_SECRET;
export const cloudinary = {
  secret: process.env.CLOUDINARY_SECRET,
  name: process.env.CLOUDINARY_NAME,
  key: process.env.CLOUDINARY_KEY,
};
