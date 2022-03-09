"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const twilio_1 = require("twilio");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // pull .env file stuff into process.env
const accountSID = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const userNumber = process.env.PLACEHOLDER_PHONE_NUMBER; // replace this with the phone number obtained from user information later
const placeholder_message = "Hello, this is a placeholder message, you have either booked a test slot or have received your test result.";
if (!accountSID || !authToken || !twilioNumber || !userNumber)
    console.error("One or more variables missing");
else {
    // if all fields present
    const twilioClient = new twilio_1.Twilio(accountSID, authToken);
    twilioClient.messages
        .create({
        from: twilioNumber,
        to: userNumber,
        body: placeholder_message
    })
        .then(msg => console.log(msg))
        .catch(err => console.error(err));
}
