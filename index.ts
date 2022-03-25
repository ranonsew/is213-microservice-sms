import { Twilio } from "twilio";
import dotenv from "dotenv";
import { Router } from "express";

const router = Router(); // express router to separate from server

// json response messages (for logging or other things)
const err_msg = (status: number, message: string) => ({ status, message });

// environment variables and setting them up
dotenv.config(); // pull .env file stuff into process.env
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER} = process.env;
// object destructuring because it looks sort of cool

// for main post request (sending message to the user)
router.route('/')
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