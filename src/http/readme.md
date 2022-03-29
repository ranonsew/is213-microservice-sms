# HTTP how to -- (not really updated anymore)

## Steps to dockerize and use
1. Ensure that host is set to "0.0.0.0"

## Steps to use the http microservice (for production testing)
1. for sending messages:
    - e.g. using curl, postman, insomnia, etc.
    - 2 examples below using curl, send POST request, body should contain "message" and "receiver", both are strings.
        ```
        curl -X POST http://localhost:3002/v1/sms -H 'Content-Type: application/json' -d '{ "message":"<placeholder_text>", "receiver": "<international_phone_number>"}'
        ```
        ```
        curl -X POST http://localhost:3002/v1/sms -H --data-urlencode "message=<placeholder_text>" --data-urlencode "receiver=<international_phone_number>"
        ```
    - if successful, should have a response of "message has been sent to the user", and the user should receive an sms from the twilio number, otherwise a different message will be received.