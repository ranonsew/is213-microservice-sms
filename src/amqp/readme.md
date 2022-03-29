# AMQP How To

## Docker Compose
1. to run docker compose, first ensure the root directory in cmd is "is213-microservice-sms"
2. run "docker-compose -p <project-name> up"
3. unfortunately there will inevitably be an error because server.py will somehow run before rabbitmq does (unsure how to fix)
4. open docker desktop and manually run amqpTestServer container
5. it should be running fine now
6. Next you can send a message, e.g. curl, postman, insomnia, etc
    1. For Sending SMS
        - http://localhost:47170/notify_user
        - POST
        - '{ "message": "<placeholder_msg>", "receiver": "<int_phone_number>" }'
    2. For Error Log
        - http://localhost:47170/error_log
        - POST
        - '{ "code": "<error_code>", "message": "<error_msg>" }'
    3. For Activity Log
        - http://localhost:47170/activity_log
        - POST
        - '{ "code": "<activity_status>", "message": "<activity_msg>" }'