module.exports = {
  environment: process.env.NODE_ENV || "development",
  port: process.env.PORT || 8080,
  db: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
  },
  jwtConfig: {
    secret: process.env.SECRET_KEY,
    expiresIn: process.env.JWT_EXPIRES_IN
  },
  cookieConfig: process.env.COOKIE_SECRET,
  awsKeys: {
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: process.env.AWS_REGION
  },
};
