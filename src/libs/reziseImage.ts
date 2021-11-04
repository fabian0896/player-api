import sharp from 'sharp';
import * as admin from 'firebase-admin';
import { v4 } from 'uuid';

import config from '../config';

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  storageBucket: config.bucketName,
});

const bucket = admin.storage().bucket();

const reziseImage = async (image: Buffer) => {
  const sharpImage = sharp(image).jpeg({ mozjpeg: true });

  // rezise all the images
  const [smallImage, mediumImage, largeImage] = await Promise.all([
    sharpImage.resize(100).toBuffer(),
    sharpImage.resize(500).toBuffer(),
    sharpImage.resize(1000).toBuffer(),
  ]);

  // create the bucket file for each image
  const small = bucket.file(`${v4()}.jpeg`);
  const medium = bucket.file(`${v4()}.jpeg`);
  const large = bucket.file(`${v4()}.jpeg`);

  // save all image in the bucket
  await Promise.all([
    small.save(smallImage, { contentType: 'image/jpeg' }),
    medium.save(mediumImage, { contentType: 'image/jpeg' }),
    large.save(largeImage, { contentType: 'image/jpeg' }),
  ]);

  // make all images public
  await Promise.all([
    small.makePublic(),
    medium.makePublic(),
    large.makePublic(),
  ]);

  // return the url of each image
  return {
    small: small.publicUrl(),
    medium: medium.publicUrl(),
    large: large.publicUrl(),
  };
};

export default reziseImage;
