"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_js_1 = __importDefault(require("./index.js"));
const app = express_1.default();
const PORT = 3002;
const DEV_HOST = "127.0.0.1"; // for without docker
const PROD_HOST = "0.0.0.0"; // for docker
// to use the microservice: 
// https://HOST:PORT/v1/sms with a POST request
// request body should be json, in the format of { "message": "placeholder string" }
app.use(express_1.default.json())
    .use(express_1.default.urlencoded({ extended: true }))
    .use("/v1/sms", index_js_1.default)
    .listen(PORT, DEV_HOST, () => console.log(`App running on http://${DEV_HOST}:${PORT}`));
