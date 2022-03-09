# is213 microservice: SMS using Twilio

## Plan
1. NodeJS & NPM
2. Typescript
3. Twilio
4. Dockerize with Docker
5. dotenv dependency
6. get authentication id & token & twilio "from" number from .env
7. get user's "to" number from user info microservice
8. get sms "body" content from booked slot / updated test result microservices
9. steps 7 & 8 should be updated to use AMQP with RabbitMQ (use amqplib from amqp.node)

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
        - PLACEHOLDER_PHONE_NUMBER="user's_number"
          ```
    2. npm install
    3. npm run serve
3. for sending messages:
    1. for example purposes, can use curl, insomnia, postman, or something similar
    2. send a POST request to "http://localhost:3002/v1/sms" with "Content-Type" header of "application/json", body json data in the format of '{ "message": "placeholder text" }'
    3. if successful, should have a response of "message has been sent to the user", and the user should receive an sms from the twilio number
