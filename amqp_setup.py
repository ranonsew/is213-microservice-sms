# python example is213 amqp for sending and receiving

import pika
from os import environ
import atexit


# set up exchanges
log_exchange = "log_topic"
notif_exchange = "notif_topic"
# setup queues
queues = {
  "error": { "name": "Error_Log", "key": "*.error", "exchange": log_exchange },
  "activity": { "name": "Activity_Log", "key": "*.activity", "exchange": log_exchange },
  "notif": { "name": "Twilio-Sms", "key": "#", "exchange": notif_exchange }
}

rabbitHost = environ.get("rabbit_host") or "localhost"
rabbitPort = environ.get("rabbit_port") or 5672

# open connection and setup queues
connection = pika.BlockingConnection(
  pika.ConnectionParameters(
    host=rabbitHost,
    port=rabbitPort,
    locale="en-US",
    heartbeat=3600
  )
)
channel = connection.channel()
# declare the log and notif exchanges
channel.exchange_declare(exchange=log_exchange, exchange_type="topic", durable=True)
channel.exchange_declare(exchange=notif_exchange, exchange_type="topic", durable=True)


# declare and bind the 3 queues, 2 to log exchanage, 1 to notif exchange
for queue in queues.values():
  channel.queue_declare(queue=queue.get("name"), durable=True)
  channel.queue_bind(exchange=queue.get("exchange"), queue=queue.get("name"), routing_key=queue.get("key"))


# export: helper functions for publishing data to amqp
def send(exchange, queue, data):
  channel.basic_publish(
    exchange=exchange,
    routing_key=queue.get("key"),
    body=data, # data: string, transformed into byte code
    properties=pika.BasicProperties(delivery_mode = 2) # persistent
  )
# helper function for sending an error log
def sendErrorLog(error_log):
  send(log_exchange, queues.get("error"), error_log)
# helper function for sending an activity log
def sendActivityLog(activity_log):
  send(log_exchange, queues.get("activity"), activity_log)
# helper function for sending an sms through Twilio
def sendMsg(smsData):
  send(notif_exchange, queues.get("notif"), smsData)


# closing channel when process is ended
# def closeChannel():
#   channel.close()
#   connection.close()
# atexit.register(closeChannel())