# python example is213 amqp for sending and receiving

import pika

exchange = { "name": "log_topic", "type": "topic" }
queue = {
  "error": { "name": "Error_Log", "key": "*.error" },
  "activity": { "name": "Activity_Log", "key": "*.activity" },
  "notification": { "name": "Twilio-Sms", "key": "*.notification" }
}
notification = { "name": "Twilio-Sms", "key": "*.notification" }

def openConnection():
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
  return (channel, connection)

def closeChannel(ch: BlockingChannel, conn: BlockingConnection):
  ch.close()
  conn.close()

def sendLog():
  pass

def receiveLog():
  pass

def sendMsg(jsonData: string):
  channel, connection = openConnection()
  channel.queue_declare(queue=notification.get("name"), durable=True)
  channel.queue_bind(exchange=exchange.get("name"), queue=notification.get("name"), routing_key=notification.get("key"))
  channel.basic_publish(exchange=exchange.get("name"), routing_key=notification.get("key"), body=jsonData)
  closeChannel(channel, connection)

def msgCallback(channel, method, properties, body):
  

def receiveMsg():
  channel, connection = openConnection()
  channel.basic_consume(queue=notification.get("name"))
  channel.basic_ack()
  closeChannel(channel, connection)
  pass
