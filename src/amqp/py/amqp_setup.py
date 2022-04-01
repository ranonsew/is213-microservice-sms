# python example is213 amqp for sending and receiving

import pika
from os import environ

# set up exchanges
log_exchange = "log_topic"
notif_exchange = "notif_topic"
# setup queues
queues = {
  "error": { "name": "Error_Log", "key": "*.error", "exchange": log_exchange },
  "activity": { "name": "Activity_Log", "key": "#", "exchange": log_exchange },
  "notif": { "name": "Twilio-Sms", "key": "#", "exchange": notif_exchange }
}

rabbitHost = environ.get("rabbit_host") or "localhost"
rabbitPort = environ.get("rabbit_port") or 5672

def openConnection():
  '''Opening a blocking connection to RabbitMQ and returning an AMQP channel'''
  connection = pika.BlockingConnection(
    pika.ConnectionParameters(
      host=rabbitHost,
      port=rabbitPort,
      heartbeat=3600,
      blocked_connection_timeout=3600
    )
  )
  return connection.channel()

channel = openConnection()
# declare the log and notif exchanges
channel.exchange_declare(exchange=log_exchange, exchange_type="topic", durable=True)
channel.exchange_declare(exchange=notif_exchange, exchange_type="topic", durable=True)

# declare and bind the 3 queues, 2 to log exchanage, 1 to notif exchange
for queue in queues.values():
  channel.queue_declare(queue=queue.get("name"), durable=True)
  channel.queue_bind(exchange=queue.get("exchange"), queue=queue.get("name"), routing_key=queue.get("key"))


# export: helper functions for publishing data to amqp
def send(exchange, route_key, data):
  '''
  @params {String} exchange - amqp exchange
  @params {String} route_key - queue routing key
  @params {JSON} data - json data
  Using the AMQP channel to publish json data to a specified exchange based on routing key
  '''
  channel.basic_publish(
    exchange=exchange,
    routing_key=route_key,
    body=data, # data: string, transformed into byte code
    properties=pika.BasicProperties(delivery_mode = 2) # persistent
  )
# helper function for sending an error log
def sendErrorLog(error_log, route_key):
  send(log_exchange, route_key, error_log)
# helper function for sending an activity log
def sendActivityLog(activity_log, route_key):
  send(log_exchange, route_key, activity_log)
# helper function for sending an sms through Twilio
def sendMsg(smsData, route_key):
  send(notif_exchange, route_key, smsData)
