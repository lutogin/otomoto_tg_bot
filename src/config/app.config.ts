import * as dotenv from 'dotenv-safe';
import * as path from 'path';

dotenv.config({ example: path.resolve('../', '../', '.env.example') });

const {
  TELEGRAM_BOT_TOKEN,
  PORT,
  NODE_ENV,
  MONGO_HOST,
  MONGO_PORT,
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_DATABASE,
  MONGO_URI_SCHEME,
  PAGE_SIZE,
  ADMIN_CHAT_ID,
  API_KEY,
} = process.env;

const MONGO_URI =
  NODE_ENV === 'local'
    ? `${MONGO_URI_SCHEME}://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}?retryWrites=true&w=majority`
    : `${MONGO_URI_SCHEME}://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}/${MONGO_DATABASE}?retryWrites=true&w=majority`;

export default (): Record<string, any> => ({
  TELEGRAM_BOT_TOKEN,
  PORT,
  NODE_ENV,
  MONGO_URI,
  PAGE_SIZE: Number.parseInt(PAGE_SIZE, 10),
  ADMIN_CHAT_ID: Number.parseInt(ADMIN_CHAT_ID, 10),
  API_KEY,
});
