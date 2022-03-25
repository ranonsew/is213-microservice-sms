# python example is213 amqp for sending and receiving

import pika
import atexit
# from flask import Flask, request, jsonify
# import os, sys
# import json

# set up exchange types and topic variables
exchange_name = "log_topic"
exchange_type = "topic"
topics = {
  "error": { "name": "Error_Log", "key": "*.error" },
  "activity": { "name": "Activity_Log", "key": "*.activity" },
  "notification": { "name": "Twilio-Sms", "key": "*.notification" }
}


# open connection and setup queues
connection = pika.BlockingConnection(
  pika.ConnectionParameters(
    host="localhost",
    port="5672",
    locale="en-US",
    heartbeat=3600
  )
)
channel = connection.channel()
channel.exchange_declare(exchange_name, exchange_type, durable=True)
for topic in topics.keys():
  top = topics.get("topic")
  channel.queue_declare(queue=top.get("name"), durable=True)
  channel.queue_bind(exchange=exchange_name, queue=top.get("name"), routing_key=top.get("key"))


# helper functions for sending data
# topic: topic dictionary -- error, activity, or notification
# data: error message string or json.dumps({ "message": "hello world", "receiver": "phone number" })
def send(topic, data):
  channel.basic_publish(exchange=exchange_name, routing_key=topic.get("key"), body=data)

# flask stuff goes here
def sendErrorLog(error_log):
  send(topics.get("error"), error_log)

def sendActivityLog(activity_log):
  send(topics.get("activity"), activity_log)

def sendMsg(smsData):
  send(topics.get("notification"), smsData)


# closing channel when process is ended
def closeChannel():
  channel.close()
  connection.close()
atexit.register(closeChannel())