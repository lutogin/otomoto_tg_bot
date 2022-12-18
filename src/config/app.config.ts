// import * as dotenv from 'dotenv-safe';
//
// dotenv.config();

const {
  TELEGRAM_API_TOKEN,
  PORT,
  NODE_ENV,
  MONGO_HOST,
  MONGO_PORT,
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_DATABASE,
  MONGO_URI_SCHEME,
} = process.env;

export default () => ({
  TELEGRAM_API_TOKEN,
  PORT,
  NODE_ENV,
  MONGO_HOST,
  MONGO_PORT,
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_DATABASE,
  MONGO_URI_SCHEME,
});
