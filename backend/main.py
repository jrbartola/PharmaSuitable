from flask import Flask, request, jsonify, send_from_directory
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

# Route to download PDF summary
@app.route('/pdf', methods=['GET'])
@cross_origin()
def get_pdf():
    return send_from_directory('../www/static/', 'PharmaSuitable.pdf')


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
            if pill['remaining'] <= 2:
                pill['color'] = 'red'
            elif pill['remaining'] <= 3:
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

        if p['remaining'] <= 2:
            p['color'] = 'red'
        elif p['remaining'] <= 3:
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

    pill = db.pills.find_one({'name': pill_name})

    if pill is not None and pill['remaining'] > 0:
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
            {'day': time.day - 1, 'month': time.month - 1, 'year': time.year}, 'remaining': 30}})

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

# API Route for asking Lex to identify shape and color
@app.route('/api/identify/<shape>/<color>', methods=['GET'])
@cross_origin()
def identify_pill(shape, color):
    from bson.json_util import dumps

    pill = db.pills.find_one({'shape': shape, 'color': color})
    response = 200

    if pill is None:
        response = 404

    return dumps({'data': pill, 'response': response})

# API Route for posting temperature data
@app.route('/api/temperature/<temp>', methods=['GET'])
@cross_origin()
def send_temperature(temp):
    from bson.json_util import dumps

    db.temp.insert_one({'value': temp, 'time': datetime.now()})

    return dumps({'data': temp, 'response': 200})

# API Route for getting the most recent temperature data
@app.route('/api/temperature', methods=['GET'])
@cross_origin()
def get_temperature():
    from bson.json_util import dumps

    # Get most recent temperature in the database
    temperature = list(db.temp.find().sort('time', -1))[0]

    return dumps({'data': temperature, 'response': 200})

# Reset the prescriptions to their original values
@app.route('/api/reset/<pillname>', methods=['GET'])
@cross_origin()
def reset_pills(pillname):
    from bson.json_util import dumps

    pill = pillname.title()

    pills_json = [{
  'id': 0,
  'name': "Tylenol",
  'dose': {
    'amount': 800,
    'unit': "mg"
  },
  'remaining': 2,
  'last_refill': {
    'day': 12,
    'month': 9,
    'year': 2017
  },
  'description': "Treats minor aches and pains, and reduces fever",
  'dose_time': {
    'hour': 10,
    'minute': 30
  },
  'last_taken': {
    'minute': 30,
    'hour': 10,
    'day': 2,
    'month': 10
  },
  'shape': "oval",
  'color': "white",
  'streak': [1, 0, 1, 1, 1, 1, 0]
},

{
  'id': 1,
  'name': "Tramadol",
  'dose': {
    'amount': 50,
    'unit': "mg"
  },
  'remaining': 3,
  'last_refill': {
    'day': 27,
    'month': 9,
    'year': 2017
  },
  'description': "Treats moderate to severe pain",
  'dose_time': {
    'hour': 12,
    'minute': 45
  },
  'last_taken': {
    'minute': 45,
    'hour': 12,
    'day': 3,
    'month': 10
  },
  'shape': "circle",
  'color': "white",
  'streak': [1, 1, 1, 1, 1, 1, 0]
},
  {
  'id': 2,
  'name': "Benadryl",
  'dose': {
    'amount': 100,
    'unit': "mg"
  },
  'remaining': 4,
  'last_refill': {
    'day': 1,
    'month': 10,
    'year': 2017
  },
  'description': "It can treat hay fever, allergies, cold symptoms, and insomnia",
  'dose_time': {
    'hour': 15,
    'minute': 0
  },
  'last_taken': {
    'minute': 0,
    'hour': 15,
    'day': 3,
    'month': 10
  },
  'shape': "capsule",
  'color': "pink",
  'streak': [1, 1, 1, 1, 1, 1, 1]
}]

    db.pills.remove({'name': pill})

    if pill == pills_json[0]['name']:
        db.pills.insert(pills_json[0])
    elif pill == pills_json[1]['name']:
        db.pills.insert(pills_json[1])
    elif pill == pills_json[2]['name']:
        db.pills.insert(pills_json[2])

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

    td = time - datetime(int(year), int(month + 1), int(day + 1))

    return td.days


# Run the server on port 3000
if __name__ == "__main__":
    app.run(debug=False, port=3000, host='0.0.0.0')