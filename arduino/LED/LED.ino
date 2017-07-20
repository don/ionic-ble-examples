#include <CurieBLE.h>
#define LED_PIN 6

// create peripheral instance
BLEPeripheral blePeripheral;

// create service
BLEService ledService = BLEService("FF10");

// create switch and dimmer characteristic
BLECharCharacteristic switchCharacteristic = BLECharCharacteristic("FF11", BLERead | BLEWrite);
BLEDescriptor switchDescriptor = BLEDescriptor("2901", "Switch");
BLEUnsignedCharCharacteristic dimmerCharacteristic = BLEUnsignedCharCharacteristic("FF12", BLERead | BLEWrite);
BLEDescriptor dimmerDescriptor = BLEDescriptor("2901", "Dimmer");

void setup() {
  Serial.begin(9600);

  // set LED pin to output mode
  pinMode(LED_PIN, OUTPUT);

  // set advertised local name and service UUID
  blePeripheral.setLocalName("LED");
  blePeripheral.setDeviceName("LED");
  blePeripheral.setAdvertisedServiceUuid(ledService.uuid());

  // add service and characteristics
  blePeripheral.addAttribute(ledService);
  blePeripheral.addAttribute(switchCharacteristic);
  blePeripheral.addAttribute(switchDescriptor);
  blePeripheral.addAttribute(dimmerCharacteristic);
  blePeripheral.addAttribute(dimmerDescriptor);

  // assign event handlers for characteristic
  switchCharacteristic.setEventHandler(BLEWritten, switchCharacteristicWritten);
  dimmerCharacteristic.setEventHandler(BLEWritten, dimmerCharacteristicWritten);

  // begin initialization
  blePeripheral.begin();

  // set the default value
  dimmerCharacteristic.setValue(0xFF);
  
  Serial.println(F("Bluetooth LED"));
}

void loop() {
  // Tell the bluetooth radio to do whatever it should be working on
  blePeripheral.poll();
}

void switchCharacteristicWritten(BLECentral& central, BLECharacteristic& characteristic) {
  // central wrote new value to characteristic, update LED
  Serial.print(F("Characteristic event, written: "));

  if (switchCharacteristic.value()) {
    Serial.println(F("LED on"));
    analogWrite(LED_PIN, dimmerCharacteristic.value());
  } else {
    Serial.println(F("LED off"));
    analogWrite(LED_PIN, 0x00);
  }

}

void dimmerCharacteristicWritten(BLECentral& central, BLECharacteristic& characteristic) {
  Serial.print(F("Dimmer set to: "));
  Serial.println(dimmerCharacteristic.value());

  analogWrite(LED_PIN, dimmerCharacteristic.value());
}
