char turnOnLED0 = 'A';
char turnOnLED1 = 'B';
char turnOnLED2 = 'C';
char turnOffLED0 = 'a';
char turnOffLED1 = 'b';
char turnOffLED2 = 'c';
char readPR0 = 'd';
char readPR1 = 'e';
char readPR2 = 'f';
char readTemp = 'g';
char readHeart = 'h';

int LEDChannels[] = {2, 3, 4};
int PRChannels[] = {0, 1, 2};

int tempChannel = 3;
int heartChannel = 4;

double Thermistor(int RawADC) {
  double Temp;
  Temp = log(10000.0*((1024.0 / RawADC-1))); 
  Temp = 1 / (0.001129148 + (0.000234125 + (0.0000000876741 * Temp * Temp ))* Temp );
  Temp = Temp - 273.15;            // Convert Kelvin to Celcius
  Temp = (Temp * 9.0)/ 5.0 + 32.0; // Convert Celcius to Fahrenheit
  return Temp;
}


void setup() {
  Serial.begin(9600);
  for(int i = 0; i < 3; i++){
    pinMode(LEDChannels[i], OUTPUT);
  }
}

void loop(){
  if (Serial.available() > 0){
    char command = Serial.read();
    
    if(command == turnOnLED0){
      digitalWrite(LEDChannels[0], HIGH);
    }
      
    else if(command == turnOnLED1){
      digitalWrite(LEDChannels[1], HIGH);
    }

    else if(command == turnOnLED2){
      digitalWrite(LEDChannels[2], HIGH);
    }
    
    else if(command == turnOffLED0){
      digitalWrite(LEDChannels[0], LOW);
    }
    
    else if(command == turnOffLED1){
      digitalWrite(LEDChannels[1], LOW);
    }
    
    else if(command == turnOffLED2){
      digitalWrite(LEDChannels[2], LOW);
    }
    
    else if(command == readPR0){
      Serial.println(analogRead(PRChannels[0]));
      
    }
    else if(command == readPR1){
      Serial.println(analogRead(PRChannels[1]));
    }
    else if(command == readPR2){
      Serial.println(analogRead(PRChannels[2]));
    }
    else if(command == readTemp){
      Serial.println(144 - (int) Thermistor(analogRead(tempChannel)));
    }
    else if(command == readHeart){
      Serial.println(analogRead(heartChannel));
    }
  }
}
