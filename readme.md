# is213 microservice: SMS using Twilio

## Why
- is213 project work, sms microservice api thingy
- built in Node, Express, Typescript
- currently still in development, not yet ready for production (final project stages)

## Steps to use this microservice (for production testing)
0. before compilation
    1. set PROD_HOST if using with Docker, otherwise set DEV_HOST in the .listen() section
1. for compilation:
    1. "npm install -g typescript"
    2. "tsc"
2. for running js files after ts files compiled to js:
    1. create a .env file with the following contents:
          ```
        - TWILIO_ACCOUNT_SID="account_sid"
        - TWILIO_AUTH_TOKEN="auth_token"
        - TWILIO_PHONE_NUMBER="twilio_number"
          ```
    2. "npm install"
    3. "npm run serve" or "node server.js"
3. for sending messages:
    - e.g. using curl, postman, insomnia, etc.
    - 2 examples below using curl, send POST request, body should contain "message" and "receiver", both are strings.
        ```
        curl -X POST http://localhost:3002/v1/sms -H 'Content-Type: application/json' -d '{ "message":"placeholder_text", "receiver": "international_phone_number"}'
        ```
        ```
        curl -X POST http://localhost:3002/v1/sms -H --data-urlencode "message=placeholder_text" --data-urlencode "receiver=international_phone_number"
        ```
    - if successful, should have a response of "message has been sent to the user", and the user should receive an sms from the twilio number, otherwise a different message will be received.
