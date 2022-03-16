import { Twilio } from "twilio";
import dotenv from "dotenv";
import express from "express";

const router = express.Router(); // express router to separate from server

// json response messages (for logging or other things)
const return_msg = (message: string) => ({ message });
const err_msg = (status: number, message: string) => ({ status, message });

// environment variables and setting them up
dotenv.config(); // pull .env file stuff into process.env
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER} = process.env;
// object destructuring because it looks sort of cool

// for main post request (sending message to the user)
router.route('/')
  .post((req, res) => {
    const { message, receiver } = req.body; // retrieving message from the request body
    // if message or receiver isn't applied or is not of type string
    if (!message || typeof message != "string" || !receiver || typeof receiver != "string") res.status(400).json(return_msg("One or more body variables has not been added"));
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) res.status(500).json(return_msg("One or more environment variables are missing"));
    else {
      const twilioClient = new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
      twilioClient.messages
        .create({
          from: TWILIO_PHONE_NUMBER,
          to: receiver,
          body: message
        })
        .then((msg) => res.status(200).json({ ...return_msg("Message has been sent to the user"), send_date: msg.dateSent }))
        .catch((err) => res.status(500).json({ ...return_msg("Something went wrong during the sending of the message"), err }));
    }
  });

router.route('/async')
  .post(async (req, res) => {
    const { message, receiver } = req.body;
    try {
      // if there is something missing, throw error, which will move to the catch statement
      if (!message || typeof message != "string" || !receiver || typeof receiver != "string") throw err_msg(400, "One or more body variables have not been added.");
      if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) throw err_msg(500, "One or more environment variables are missing.");
      const twilioClient = new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
      const result = await twilioClient.messages.create({
        from: TWILIO_PHONE_NUMBER,
        to: receiver,
        body: message
      });
      if (!result) throw err_msg(500, "Something went wrong while sending the message.");
      res.status(200).json({ message: "Message has been sent to the user." });
    } catch (err: any) {
      if (err.status && err.message) res.status(err.status).json(err.message);
      console.log(err);
    }
  });


// for all invalid routes, such as for get requests or post requests that we aren't expecting
// using .all() to target all routes after the initial post request
router.route('*')
  .all((req, res) => res.status(400).json({ message: "Invalid URL" }));

export default router;