# python example is213 amqp for sending and receiving

import pika
import atexit

exchange = { "name": "log_topic", "type": "topic" }
topics = {
  "error": { "name": "Error_Log", "key": "*.error" },
  "activity": { "name": "Activity_Log", "key": "*.activity" },
  "notification": { "name": "Twilio-Sms", "key": "*.notification" }

}
notification = { "name": "Twilio-Sms", "key": "*.notification" }


connection = pika.BlockingConnection(
  pika.ConnectionParameters(
    host="localhost",
    port="5672",
    locale="en-US",
    heartbeat=3600
  )
)
channel = connection.channel()
channel.exchange_declare(exchange.get("name"), exchange.get("type"), durable=True)

for topic in topics.keys():
  queue_name = topics.get(topic).get("name")
  key = topics.get(topic).get("key")
  channel.queue_declare(queue=queue_name, durable=True)
  channel.queue_bind(exchange=exchange.get("name"), queue=queue_name, routing_key=key)



def sendLog():
  pass

def callback():
  pass

def sendMsg(jsonData):
  channel.queue_declare(queue=notification.get("name"), durable=True)
  channel.queue_bind(exchange=exchange.get("name"), queue=notification.get("name"), routing_key=notification.get("key"))
  channel.basic_publish(exchange=exchange.get("name"), routing_key=notification.get("key"), body=jsonData)

def closeChannel():
  channel.close()
  connection.close()

atexit.register(closeChannel())