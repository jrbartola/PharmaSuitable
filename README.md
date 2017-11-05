# PharmaSuitable

A pharmaceutical and health monitoring application for the elderly.  While we made a custom smart pill-box, we specifically designed and open-sourced an API for our web interface so that anyone can make their own smart pill-box, or any other pill-tracking device!



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
 #### `GET: /api/pill/\<pill name>`
 >**Returns** the pill entry of a pill (see pill entry schema)
 #### `GET: /api/pills`
 >**Returns** an array of all pill entries in the web interface (see pill entry schema)
 #### `GET: /api/ingest/\<pill name>`
 >Tells the web server that a pill has been removed from the pill box, causing the pill's data to be updated. **Returns** the pill's data from before the update (see pill entry schema)
 #### `GET: /api/refill/\<pill name>`
 >Tells the web server that the supply of a specific pill has been refilled. **Returns** the pill's data from before the update (see pill entry schema)
 #### `GET: /api/identify/\<shape>/\<color>`
 >Queries the server for pills with a matching shape and color (used for integrating with Amazon Lex). **Returns** pill entries for matching pills (see pill entry schema)
 #### `GET: /api/temperature/\<temp>`
 >Tells the web server the most recent measurement of the subject's temperature. **Returns** the temperature value which was sent to the server back to the user
  
 
