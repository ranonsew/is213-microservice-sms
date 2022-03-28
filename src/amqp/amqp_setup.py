# python example is213 amqp for sending and receiving

import pika
from os import environ

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
    # locale="en-US",
    heartbeat=3600,
    blocked_connection_timeout=3600
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


def is_connection_open(connection):
  try:
    connection.process_data_events()
    return True
  except pika.exceptions.AMQPError as e:
    print("AMQP Error: ", e)
    print("...creating new connection.")
    return False

def check_setup():
  global connection, channel, rabbitHost, rabbitPort, log_exchange, notif_exchange
  if not is_connection_open(connection):
    connection = pika.BlockingConnection(
      pika.ConnectionParameters(
        host=rabbitHost,
        port=rabbitPort,
        # locale="en-US",
        heartbeat=3600,
        blocked_connection_timeout=3600
      )
    )
  if channel.is_closed():
    channel = connection.channel()
    # declare the log and notif exchanges
    channel.exchange_declare(exchange=log_exchange, exchange_type="topic", durable=True)
    channel.exchange_declare(exchange=notif_exchange, exchange_type="topic", durable=True)


# export: helper functions for publishing data to amqp
def send(exchange, queue, data):
  # check_setup() # currently causes error when trying to work things out
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
