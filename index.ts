import { Twilio } from "twilio";
import dotenv from "dotenv";
import express from "express";

const router = express.Router(); // express router to separate from server

// json response messages (for logging or other things)
const returnMsg = (message: string) => ({ message });
const msg_invalid = "Invalid URL";

// environment variables and setting them up
dotenv.config(); // pull .env file stuff into process.env
// const accountSID = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
// const userNumber = process.env.PLACEHOLDER_PHONE_NUMBER;
const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER,
  PLACEHOLDER_PHONE_NUMBER
} = process.env; // object destructuring because it looks sort of cool

// for main post request (sending message to the user)
router.route('/')
  .post((req, res) => {
    const { message } = req.body; // retrieving message from the request body
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER || !PLACEHOLDER_PHONE_NUMBER) res.status(500).json(returnMsg("One or more variables are missing"));
    // if (!accountSID || !authToken || !twilioNumber || !userNumber) res.status(500).json(returnMsg("One or more variables are missing"));
    else {
      const twilioClient = new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
      // const twilioClient = new Twilio(accountSID, authToken);
      twilioClient.messages
        .create({
          from: TWILIO_PHONE_NUMBER,
          to: PLACEHOLDER_PHONE_NUMBER,
          body: message
        })
        .then((msg) => res.status(200).json(returnMsg("Message has been sent to the user")))
        .catch((err) => res.status(500).json(returnMsg("Something went wrong during the sending of the message")));
    }
  });

// for all invalid routes, such as for get requests or post requests that we aren't expecting
// using .all() to target all routes after the initial post request
router.route('*')
  .all((req, res) => res.status(400).json(returnMsg(msg_invalid)));

export default router;