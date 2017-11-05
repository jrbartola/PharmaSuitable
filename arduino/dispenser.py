import serial, requests, time, schedule, datetime, random
ser = serial.Serial('/dev/ttyACM1', 9600, timeout=1)
LEDOnCommands = ['A', 'B', 'C']
LEDOffCommands = ['a', 'b', 'c']
PRCommands = ['d', 'e', 'f']
tempCommand = 'g';
heartCommand = 'h';

pillNames = ['Tylenol', 'Tramadol', 'Benadryl']
nextPillTimes = [None, None, None]
pillLights = [False, False, False]

normalPRValues = [961, 979, 980]
PRdelta = 100
doseTimeDelta = 1800

timeSinceLastSchedule = 0
lastReset = 0

apiURL = 'http://18.221.211.47:3000'

def turnOnLED(i):
    ser.write(LEDOnCommands[i])
    pillLights[i] = True


def turnOffLED(i):
    ser.write(LEDOffCommands[i])
    pillLights[i] = False


def getPR(i):
    ser.write(PRCommands[i])
    return int(ser.readline())


def checkNextDoses():
    print "checkNextDoses Triggered"
    r = requests.get(apiURL + '/api/pills')
    for i in range(3):
        now = datetime.datetime.now()
        nextPillTimes[i] = datetime.datetime(now.year, now.month, now.day, int(r.json()['data'][i]['dose_time']['hour']), int(r.json()['data'][i]['dose_time']['minute']))



def turnOnNecessaryLEDs():
    print "turnOnNecessaryLEDs Triggered"

    for i in range(3):
        if nextPillTimes[i] is not None and abs(datetime.datetime.now() - nextPillTimes[i]).total_seconds() < doseTimeDelta:
            turnOnLED(i)


def checkAllPRs():
    global lastReset
    print "checkAllPRs Triggered"

    for i in range(3):
        if pillLights[i] and abs(getPR(i) - normalPRValues[i]) > PRdelta:
            r = requests.get(apiURL + '/api/ingest/' + pillNames[i])
            nextPillTimes[i] += datetime.timedelta(days=1)
            turnOffLED(i)
            lastReset = 0


def checkLitPRs():
    global lastReset
    print "checkLitPRs Triggered"
    for i in range(3):
        if pillLights[i] and abs(getPR(i) - normalPRValues[i]) > PRdelta:
            r = requests.get(apiURL + '/api/ingest/' + pillNames[i])
            nextPillTimes[i] += datetime.timedelta(days=1)
            turnOffLED(i)
            lastReset = 0


def getTemp():
    ser.write(tempCommand)
    return int(ser.readline())


def sendtTemp():

    r = requests.get(apiURL + '/api/temperature/' + str(getTemp()))


schedule.every(5).minutes.do(checkNextDoses)
schedule.every(1).seconds.do(turnOnNecessaryLEDs)
schedule.every(2).seconds.do(sendtTemp)
checkNextDoses()
turnOnNecessaryLEDs()

turnOnLED(0)
turnOnLED(1)
turnOnLED(2)

a = ser.readline()
while True:
    if timeSinceLastSchedule == 0:
        schedule.run_pending()

    # if(getButton()):
    #     turnOnLED(1)
    checkLitPRs()
    timeSinceLastSchedule = (timeSinceLastSchedule + 1) % 10
    lastReset += .2
    print lastReset
    if abs(lastReset - 13.0) < 0.1:
        turnOnLED(random.randint(0, 2))
    print getTemp()
    time.sleep(.2)
