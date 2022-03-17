import express from "express";
import twilioSMS from "./index.js";

const app = express();
const PORT = 3002;
const HOST = "0.0.0.0"; // 127.0.0.1

// to use the microservice: 
// https://HOST:PORT/v1/sms with a POST request
// request body should be json, in the format of { "message": "placeholder string" }
app.use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use("/v1/sms", twilioSMS)
  .listen(PORT, HOST, () => console.log(`App running on http://${HOST}:${PORT}.`));