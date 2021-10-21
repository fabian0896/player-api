import dotenv from 'dotenv';

dotenv.config();

const config = {
  env: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET as string,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET as string,
  bucketName: process.env.BUCKET_NAME!,
  jwtInviteSecret: process.env.JWT_INVITE_SECRET!,
};

export default config;
