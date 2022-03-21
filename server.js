"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_js_1 = __importDefault(require("./index.js"));
const app = (0, express_1.default)();
const PORT = 3002;
const HOST = "127.0.0.1"; // change to 0.0.0.0 for docker, change to 127.0.0.1 for in cmd testing
// to use the microservice: 
// https://HOST:PORT/v1/sms with a POST request
// request body should be json, in the format of { "message": "placeholder string" }
app.use(express_1.default.json())
    .use(express_1.default.urlencoded({ extended: true }))
    .use("/v1/sms", index_js_1.default)
    .listen(PORT, HOST, () => console.log(`Send POST request to http://${HOST}:${PORT}/v1/sms.`));
// container 0.5 = 42585b9f1940cb4f7954c028031452b2c9be7730baa77e1b4259f0387108407c
