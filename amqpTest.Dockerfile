FROM python:3-slim
WORKDIR /usr/src/app
COPY amqpTest.req.txt amqp_setup.py server.py ./
RUN python -m pip install --no-cache-dir -r http.reqs.txt
EXPOSE 5101
CMD [ "python", "server.py" ]