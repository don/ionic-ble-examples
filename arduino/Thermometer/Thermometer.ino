#include <CurieBLE.h>

BLEPeripheral blePeripheral;
BLEService thermometerService = BLEService("BBB0");
BLEFloatCharacteristic temperatureCharacteristic = BLEFloatCharacteristic("BBB1", BLERead | BLENotify);
BLEDescriptor temperatureDescriptor = BLEDescriptor("2901", "degrees C");

#define TEMPERATURE_PIN A0

unsigned long previousMillis = 0;  // will store last time temperature was updated
unsigned short interval = 2000;    // interval at which to read temperature (milliseconds)

void setup()
{
  Serial.begin(9600);
  Serial.println(F("Bluetooth Low Energy Thermometer"));

  // set advertised name and service
  blePeripheral.setLocalName("Thermometer");
  blePeripheral.setDeviceName("Thermometer");
  blePeripheral.setAdvertisedServiceUuid(thermometerService.uuid());

  // add service and characteristic
  blePeripheral.addAttribute(thermometerService);
  blePeripheral.addAttribute(temperatureCharacteristic);
  blePeripheral.addAttribute(temperatureDescriptor);

  blePeripheral.begin();
}

void loop()
{
  // Tell the bluetooth radio to do whatever it should be working on
  blePeripheral.poll();

  // limit how often we read the sensor
  if(millis() - previousMillis > interval) {
    pollTemperatureSensor();
    previousMillis = millis();
  }
}

void pollTemperatureSensor()
{
  float temperature = calculateTemperature();

  // only set the characteristic value if the temperature has changed
  if (temperatureCharacteristic.value() != temperature) {
    temperatureCharacteristic.setValue(temperature);
    Serial.println(temperature);
  }
}

// calculate the temperature from the sensor reading
// https://learn.adafruit.com/tmp36-temperature-sensor/using-a-temp-sensor
float calculateTemperature()
{
  // read the sensor value
  int sensorValue = analogRead(TEMPERATURE_PIN);

  // 3.3v logic, 10-bit ADC
  float voltage = sensorValue * 3.3 / 1024.0;
  // 100 degrees per volt with 0.5 volt offset  
  float temperature = (voltage - 0.5) * 100;  

  return temperature;
}
