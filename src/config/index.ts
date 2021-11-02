import dotenv from 'dotenv';

dotenv.config();

const config = {
  env: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET as string,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET as string,
  bucketName: process.env.BUCKET_NAME!,
  jwtInviteSecret: process.env.JWT_INVITE_SECRET!,
  reportApi: process.env.REPORT_API!,
  reportUser: process.env.REPORT_USER!,
  reportPassword: process.env.REPORT_PASSWORD!,
  sendgridApiKey: process.env.SENDGRID_API_KEY!,
  sendgridEmail: process.env.SENDGRID_EMAIL!,
  emailUser: process.env.EMAIL_USER!,
  emailPassword: process.env.EMAIL_PASSWORD!,
};

export default config;
