# is213 microservice: SMS using Twilio

## Why
- is213 project work, sms microservice api thingy
- built in Node, Express, Typescript
- currently still in development, not yet ready for production (final project stages)


## Versions
- 🐰 [AMQP version](./src/amqp/readme.md)

- 💻 [HTTP version](./src/http/readme.md)


## Development steps
1. Ensure directory is "is213-microservice-sms"
2. Install the necessary dependencies
    1. Global Dependencies: "npm install -g typescript"
    2. For Python: "python -m pip install -r amqpTest.req.txt"
    3. For JS: "npm install"
3. Create a .env file with the following items
    ```
    - TWILIO_ACCOUNT_SID="<account_sid>"
    - TWILIO_AUTH_TOKEN="<auth_token>"
    - TWILIO_PHONE_NUMBER="<twilio_number>"
    ```
4. For dockerization, ensure terminal directory is the root dir for the repo
    - i.e. cmd directory should be "is213-microservice-sms"
