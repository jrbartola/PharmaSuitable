# PharmaSuitable

A pharmaceutical and health monitoring application for the elderly.  Many adults are unable to leave their elderly relatives home alone, especially, if they fear that their relatives will forget or fail to take necessary medications.  Our project solves this problem by providing a smart pill-box that detects when a pill is removed, as well as a web interface that allows a concerned relative to remotely check on the status of the pill-box and as any other health measurements, such as thermometer measurements. Additionally, we integrated Amazon Lex into our web interface, allowing many elderly patients to use the web interface to get data on their medication, even if they are unable to use a computer.

While we made a custom smart pill-box, we specifically designed and open-sourced an API for our web interface so that anyone can make their own smart pill-box, or any other pill-tracking device!

![Alt text](/dashboard.png "The main dashboard")

## API

### Pill Entry Schema
`streak` (array of ints): array of 7 values, representing the subject's record in taking the pill over the previous week. Each value representing a specific day (first value is Sunday, and the last is Saturday), where 1 means that a pill was taken that day, and 0 means that one wasn't

color` (string): the color of the pill

id` (int): unique identifier assigned to pill

`remaining` (int): number of pills that the user still has

`description` (string): description of the pill and what it is used for

`last_refill` (dictionary): contains the last time that during which the pill's supply was refilled
    * `month` (int): month of the time during which the pill's supply was refilled (note: this is zero indexed)
    * `day` (int): day of the time during which the pill's supply was refilled (note: this is zero indexed)
    * `year` (int): year of the time during whch the pill's supply was refilled
    
`next_dose` (dictionary): contains the daily time on during which the pill is scheduled to be taken
    * `hour` (int): hour of the scheduled time
    * `minute` (int): minute of the scheduled time
    
`time_since_refill` (int): number of days since the pill's supply was refilled

`dose` (dictionary): the daily dosage of the pill
    * `amount` (int): mass of pill
    * `unit` (int): unit of the mass of he pill
    
`shape` (string): description of the shape of the pill

`last_taken` (dictionary): contains the time during which the pill was last taken
    * `hour` (int): hour of the time during which the pill was last taken
    * `minute` (int): minute of the time during which the pill was last taken
    * `month` (int): month of the time during which the pill was last taken (note: this is zero indexed)
    * `day` (int): day of the time during which the pill was last taken (note: this is zero indexed)
    
`name` (string): name of the pill
 ### Endpoints
 #### `GET: /api/pill/<pill name>`
 >**Returns** the pill entry of a pill (see pill entry schema)
 #### `GET: /api/pills`
 >**Returns** an array of all pill entries on the server (see pill entry schema)
 #### `GET: /api/ingest/<pill name>`
 >Tells the web server that a pill has been removed from the pill box, causing the pill's data to be updated. **Returns** the pill's data from before the update (see pill entry schema)
 #### `GET: /api/refill/<pill name>`
 >Tells the web server that the supply of a specific pill has been refilled. **Returns** the pill's data from before the update (see pill entry schema)
 #### `GET: /api/identify/<shape>/<color>`
 >Queries the server for pills with a matching shape and color (used for integrating with Amazon Lex). **Returns** pill entries for matching pills (see pill entry schema)
 #### `GET: /api/temperature/<temp>`
 >Tells the web server the most recent measurement of the subject's temperature. **Returns** the temperature value which was sent to the server back to the user
  
 
## Examples
### Search for a pill on the server (Python 3)
```
import requests
serverDomain = "<your server domain here>"
shape = input("What is the shape of your pill?\n")
color = input("What color is your pill?\n")
r = requests.get(serverDomain + '/api/temperature/' + shape/' + 'color'
print("Your pill is: " + r.json()['data']['name']")
```

## Amazon Lex
As we said earlier, we integrated Amazon Lex into our web interface.  This technology is essential to allowing the elderly to get information from the web interface.  While most of the web interface is designed for relatives with at least some computer experience, Lex can be used by anyone who can talk. Here are just some of the questions you can ask Lex:

"When am I taking *medicine name* next?"

--

"When do I need a refill of *medicine name*?"

--

"What pill is this?"

> What color is it?

"Pink"

> What shape is it?

"Capsule"

> That pill sounds like Benadryl.  It can treat hay fever, allergies, cold symptoms, and insomnia.

