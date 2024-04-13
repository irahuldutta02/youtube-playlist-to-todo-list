const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT;
const SERVER_URL = process.env.SERVER_URL;
const NODE_ENV = process.env.NODE_ENV;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

module.exports = {
  PORT,
  SERVER_URL,
  NODE_ENV,
  YOUTUBE_API_KEY,
};
