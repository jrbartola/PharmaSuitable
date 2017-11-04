from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from pymongo import MongoClient

from datetime import datetime

client = MongoClient()
db = client.pharm

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


if app.debug is not True:
    import logging
    from logging.handlers import RotatingFileHandler
    file_handler = RotatingFileHandler('errors.log', maxBytes=1024 * 1024 * 100, backupCount=20)
    file_handler.setLevel(logging.ERROR)
    formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
    file_handler.setFormatter(formatter)
    app.logger.addHandler(file_handler)

@app.route("/")
def hello():
    return "Entry point.."


# API Route for pill information
@app.route('/api/pills/<pillname>', methods=['GET', 'PUT', 'DELETE'])
@cross_origin()
def pill_route(pillname):
    from bson.json_util import dumps

    pill_name = pillname.title()

    if request.method == 'GET':
        pill = db.pills.find_one({'name': pill_name})
        response = 200

        if pill is None:
            response = 404
        else:
            if pill['remaining'] <= 5:
                pill['color'] = 'red'
            elif pill['remaining'] <= 10:
                pill['color'] = 'orange'
            else:
                pill['color'] = 'green'

            pill['next_dose'] = time_until_next_dose(pill['dose_time'])
            pill['time_since_refill'] = time_since_refill(pill['last_refill'])

        return dumps({'data': pill, 'response': response})

    elif request.method == 'PUT':
        return dumps({'data': None, 'response': 200})

    elif request.method == 'DELETE':
        pill = db.messages.delete_one({'name': pill_name})
        return dumps({'data': pill, 'response': 200})

    # This should never execute
    return jsonify({'data': None, 'response': 200})


# API Route for pill information
@app.route('/api/pills', methods=['GET'])
@cross_origin()
def all_pills():
    from bson.json_util import dumps
    pills = list(db.pills.find())

    for p in pills:
        # Add a field indicating how much time is left until the next dose
        p['next_dose'] = time_until_next_dose(p['dose_time'])
        p['time_since_refill'] = time_since_refill(p['last_refill'])

        if p['remaining'] <= 5:
            p['color'] = 'red'
        elif p['remaining'] <= 10:
            p['color'] = 'orange'
        else:
            p['color'] = 'green'


    # Sort in order of next dose
    pills = sorted(pills, key=lambda k: k['next_dose']['hour'])

    return dumps({'data': pills, 'response': 200})

# Ingest the pill, decrement the remaining count and update the last taken field
@app.route('/api/ingest/<pillname>', methods=['GET'])
@cross_origin()
def ingest_pill(pillname):
    pill_name = pillname.title()

    from bson.json_util import dumps
    time = datetime.now()

    pill = db.pills.find_one_and_update({'name': pill_name}, {'$inc': {'remaining': -1}, '$set': {'last_taken':
                                        {'minute': time.minute, 'hour': time.hour, 'day': time.day, 'month': time.month}}})

    return dumps({'data': pill, 'response': 200})

# Fill the prescription for this pill
@app.route('/api/refill/<pillname>', methods=['GET'])
@cross_origin()
def refill_pill(pillname):
    pill_name = pillname.title()

    from bson.json_util import dumps
    time = datetime.now()

    pill = db.pills.find_one_and_update({'name': pill_name}, {'$set': {'last_refill':
            {'day': time.day, 'month': time.month, 'year': time.year}, 'remaining': 30}})

    return dumps({'data': pill, 'response': 200})


def time_until_next_dose(dose_time):
    hour, minute = dose_time['hour'], dose_time['minute']
    time = datetime.now()

    # If we have yet to take the pill today
    if hour >= time.hour and minute >= time.minute:
        td = datetime(time.year, time.month, time.day, int(hour), int(minute)) - time
        next_dose = {'hour': int(td.seconds / 3600), 'minute': int(td.seconds / 60 % 60)}
    else:
        td = datetime(time.year, time.month, int(time.day + 1), int(hour), int(minute)) - time
        next_dose = {'hour': int(td.seconds / 3600), 'minute': int(td.seconds / 60 % 60)}

    return next_dose

def time_since_refill(last_refill):
    day, month, year = last_refill['day'], last_refill['month'], last_refill['year']
    time = datetime.now()

    td = time - datetime(int(year), int(month), int(day))

    return td.days


# Run the server on port 3000
if __name__ == "__main__":
    app.run(debug=False, port=3000, host='0.0.0.0')