FROM python:3-slim
WORKDIR /usr/src/app
COPY amqpTest.req.txt src/amqp/py/amqp_setup.py src/amqp/py/server.py ./
RUN python -m pip install --no-cache-dir -r amqpTest.req.txt
EXPOSE 5101
CMD [ "python", "server.py" ]