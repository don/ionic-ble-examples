#include <CurieBLE.h>

// create peripheral instance
BLEPeripheral blePeripheral;

// create service
BLEService buttonService = BLEService("FFE0");

// create characteristic
BLECharCharacteristic buttonCharacteristic = BLECharCharacteristic("FFE1", BLENotify);
BLEDescriptor buttonDescriptor = BLEDescriptor("2901", "Button State");

#define BUTTON_PIN 7 

unsigned long lastReadTime = 0;
unsigned char readInterval = 100;

void setup() {
  Serial.begin(9600);
  pinMode(BUTTON_PIN, INPUT);

  // set advertised local name and service UUID
  blePeripheral.setLocalName("Button");
  blePeripheral.setDeviceName("Button");
  // Advertise AA80 so this looks like a TI CC2650 Sensor Tag
  blePeripheral.setAdvertisedServiceUuid("AA80");

  // add service and characteristics
  blePeripheral.addAttribute(buttonService);
  blePeripheral.addAttribute(buttonCharacteristic);
  blePeripheral.addAttribute(buttonDescriptor);

  // begin initialization
  blePeripheral.begin();
  Serial.println(F("Bluetooth Button"));
}

void loop() {
  // Tell the bluetooth radio to do whatever it should be working on	
  blePeripheral.poll();

  // limit how often we read the button
  if (millis() - lastReadTime > readInterval) {
    readButton();
    lastReadTime = millis();
  }
}

void readButton() {
  char buttonValue = digitalRead(BUTTON_PIN);

  // has the value changed since the last read?
  if (buttonCharacteristic.value() != buttonValue) {
    Serial.print("Button ");
    Serial.println(buttonValue, HEX);
    buttonCharacteristic.setValue(buttonValue);
  }
}
