import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';

// Bluetooth UUIDs
const THERMOMETER_SERVICE = 'bbb0';
const TEMPERATURE_CHARACTERISTIC = 'bbb1';

@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {

  peripheral: any = {};
  temperature: number;
  statusMessage: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private ble: BLE,
              private alertCtrl: AlertController,
              private ngZone: NgZone) {

    let device = navParams.get('device');

    this.setStatus('Connecting to ' + device.name || device.id);

    // This is not a promise, the device can call disconnect after it connects, so it's an observable
    this.ble.connect(device.id).subscribe(
      peripheral => this.onConnected(peripheral),
      peripheral => this.showAlert('Disconnected', 'The peripheral unexpectedly disconnected')
    );

  }

  // the connection to the peripheral was successful
  onConnected(peripheral) {

    this.peripheral = peripheral;
    this.setStatus('Connected to ' + (peripheral.name || peripheral.id));

    // Subscribe for notifications when the temperature changes
    this.ble.startNotification(this.peripheral.id, THERMOMETER_SERVICE, TEMPERATURE_CHARACTERISTIC).subscribe(
      data => this.onTemperatureChange(data),
      () => this.showAlert('Unexpected Error', 'Failed to subscribe for temperature changes')
    )

    // Read the current value of the temperature characteristic
    this.ble.read(this.peripheral.id, THERMOMETER_SERVICE, TEMPERATURE_CHARACTERISTIC).then(
      data => this.onTemperatureChange(data),
      () => this.showAlert('Unexpected Error', 'Failed to get temperature')
    )
    
  }

  onTemperatureChange(buffer:ArrayBuffer) {

    // Temperature is a 4 byte floating point value
    var data = new Float32Array(buffer);
    console.log(data[0]);

    this.ngZone.run(() => {
      this.temperature = data[0];
    });

  }

  // Disconnect peripheral when leaving the page
  ionViewWillLeave() {
    console.log('ionViewWillLeave disconnecting Bluetooth');
    this.ble.disconnect(this.peripheral.id).then(
      () => console.log('Disconnected ' + JSON.stringify(this.peripheral)),
      () => console.log('ERROR disconnecting ' + JSON.stringify(this.peripheral))
    )
  }

  showAlert(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  setStatus(message) {
    console.log(message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }

}
