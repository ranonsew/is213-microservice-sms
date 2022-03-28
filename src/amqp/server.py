from flask import Flask, request, jsonify
from flask_cors import CORS
import os, sys
import json

from amqp_setup import sendErrorLog, sendActivityLog, sendMsg

app = Flask(__name__)
CORS(app)

# testing purposes
@app.route("/error_log", methods=["POST"])
def logError():
  if request.is_json:
    try:
      error_log = json.dumps(request.get_json())
      sendErrorLog(error_log)
      return jsonify({
        "code": 201,
        "message": "Successful sending"
      })
    except Exception as e:
      # Unexpected error in code
      exc_type, exc_obj, exc_tb = sys.exc_info()
      fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
      ex_str = str(e) + " at " + str(exc_type) + ": " + fname + ": line " + str(exc_tb.tb_lineno)
      print(ex_str)
      return jsonify({
        "code": 500,
        "message": ex_str
      }), 500
  return jsonify({
    "code": 400,
    "message": "Invalid JSON input: " + str(request.get_data())
  }), 400


@app.route("/activity_log", methods=["POST"])
def logActivity():
  if request.is_json:
    try:
      activity_log = json.dumps(request.get_json())
      sendActivityLog(activity_log)
      return jsonify({
        "code": 201,
        "message": "Successful sending"
      })
    except Exception as e:
      # Unexpected error in code
      exc_type, exc_obj, exc_tb = sys.exc_info()
      fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
      ex_str = str(e) + " at " + str(exc_type) + ": " + fname + ": line " + str(exc_tb.tb_lineno)
      print(ex_str)
      return jsonify({
        "code": 500,
        "message": ex_str
      }), 500
  return jsonify({
    "code": 400,
    "message": "Invalid JSON input: " + str(request.get_data())
  }), 400


@app.route("/notify_user", methods=["POST"])
def sendMessage():
  if request.is_json:
    try:
      message = json.dumps(request.get_json())
      sendMsg(message)
      return jsonify({
        "code": 201,
        "message": "Successful sending"
      })
    except Exception as e:
      # Unexpected error in code
      exc_type, exc_obj, exc_tb = sys.exc_info()
      fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
      ex_str = str(e) + " at " + str(exc_type) + ": " + fname + ": line " + str(exc_tb.tb_lineno)
      print(ex_str)
      return jsonify({
        "code": 500,
        "message": ex_str
      }), 500
  return jsonify({
    "code": 400,
    "message": "Invalid JSON input: " + str(request.get_data())
  }), 400



if __name__ == '__main__':
  print("this is flask " + os.path.basename(__file__) + " for Things")
  app.run(host="0.0.0.0", port=5101, debug=True)