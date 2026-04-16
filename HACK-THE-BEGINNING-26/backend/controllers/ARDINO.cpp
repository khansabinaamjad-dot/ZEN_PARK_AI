#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <Servo.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);
Servo gateServo;

// -------- PINS --------
const int entrySensor = 2;
const int slot1Sensor = 3;
const int slot2Sensor = 4;
const int slot3Sensor = 5;
const int servoPin = 11;
const int exitSensor = 10;

// -------- SERVO ANGLES --------
const int gateClosed = 0;
const int gateOpen = 90;

String incomingData = "";

void setup() {
  Serial.begin(9600);

  pinMode(entrySensor, INPUT);
  pinMode(slot1Sensor, INPUT);
  pinMode(slot2Sensor, INPUT);
  pinMode(slot3Sensor, INPUT);
  pinMode(exitSensor, INPUT);

  gateServo.attach(servoPin);
  gateServo.write(gateClosed);

  lcd.init();
  lcd.backlight();

  lcd.setCursor(0, 0);
  lcd.print("Smart Parking");
  lcd.setCursor(0, 1);
  lcd.print("System Ready");
  delay(2000);
  lcd.clear();
}

void loop() {
  // -------- SLOT READ --------
  int s1 = digitalRead(slot1Sensor);
  int s2 = digitalRead(slot2Sensor);
  int s3 = digitalRead(slot3Sensor);

  // -------- COUNT --------
  int occupied = 0;
  if (s1 == 0) occupied++;
  if (s2 == 0) occupied++;
  if (s3 == 0) occupied++;

  int totalSlots = 3;
  int freeSlots = totalSlots - occupied;

  // -------- LCD DISPLAY --------
  lcd.setCursor(0, 0);
  lcd.print("Free Slots: ");
  lcd.print(freeSlots);
  lcd.print("   ");

  lcd.setCursor(0, 1);
  if (freeSlots == 0) {
    lcd.print("Parking Full   ");
  } else {
    lcd.print("Waiting Plate  ");
  }

  // -------- ENTRY SENSOR --------
  int entryCar = digitalRead(entrySensor);

  if (entryCar == 0) {
    if (freeSlots > 0) {
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Entry Detected");
      lcd.setCursor(0, 1);
      lcd.print("Gate Opening");
      openGate();
      lcd.clear();
    } else {
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Parking Full");
      lcd.setCursor(0, 1);
      lcd.print("No Entry");
      delay(1500);
      lcd.clear();
    }
  }

  // -------- SERIAL (ANPR) --------
  if (Serial.available()) {
    incomingData = Serial.readStringUntil('\n');
    incomingData.trim();

    if (incomingData == "OPEN") {
      if (freeSlots > 0) {
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("Vehicle Allowed");
        lcd.setCursor(0, 1);
        lcd.print("Gate Opening");
        openGate();
      } else {
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("Parking Full");
        lcd.setCursor(0, 1);
        lcd.print("No Entry");
        delay(1500);
        lcd.clear();
      }
    }

    if (incomingData == "BLOCK") {
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Blacklisted");
      lcd.setCursor(0, 1);
      lcd.print("Access Denied");
      delay(1500);
      lcd.clear();
    }
  }

  // -------- EXIT SENSOR --------
  int exitCar = digitalRead(exitSensor);

  if (exitCar == 0) {
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Exit Detected");
    lcd.setCursor(0, 1);
    lcd.print("Gate Opening");
    openGate();
    lcd.clear();
  }

  delay(300);
}

// -------- GATE FUNCTION --------
void openGate() {
  gateServo.write(gateOpen);
  delay(3000);
  gateServo.write(gateClosed);
  delay(500);
}