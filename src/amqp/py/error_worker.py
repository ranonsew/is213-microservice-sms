import pika
from os import environ
from amqp_setup import openConnection

channel = openConnection()
channel.exchange_declare(exchange="log_topic", exchange_type="topic", durable=True)
channel.queue_declare(queue="Error_Log", durable=True)
channel.consume(queue="Error_Log")


