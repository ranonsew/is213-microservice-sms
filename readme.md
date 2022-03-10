# is213 microservice: SMS using Twilio

## Why
- is213 project work, sms microservice api thingy
- api for twilio api I guess
- built in Node

## Steps to use this microservice (for production testing)
1. for compilation:
    1. npm install -g typescript
    2. npm run build
2. for running js files after ts files compiled to js:
    1. create a .env file with the following contents:
          ```
        - TWILIO_ACCOUNT_SID="your_account_sid"
        - TWILIO_AUTH_TOKEN="your_auth_token"
        - TWILIO_PHONE_NUMBER="your_twilio_number"
          ```
    2. npm install
    3. npm run serve
3. for sending messages:
    1. for example purposes, can use curl, insomnia, postman, or something similar
    2. send a POST request to "http://localhost:3002/v1/sms" with 'Content-Type' header of 'application/json', body json data in the format of '{ "message": "placeholder_text", "receiver": "international_phone_number" }'
    3. if successful, should have a response of "message has been sent to the user", and the user should receive an sms from the twilio number
