import { BLE } from '@ionic-native/ble';
import { Component, NgZone } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import { DetailPage } from '../detail/detail';

const NEOPIXEL_SERVICE = 'ccc0';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  devices: any[] = [];
  statusMessage: string;

  constructor(public navCtrl: NavController, 
              private ble: BLE,
              private alertCtrl: AlertController,
              private ngZone: NgZone) { 
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter');
    this.scan();
  }

  scan() {
    this.devices = [];  // clear existing list
    this.ble.scan([NEOPIXEL_SERVICE], 4).subscribe(
      device => this.onDiscoveredDevice(device), 
      e => this.showAlert('Scan Failed', 'Error scanning for BLE devices.')
    );

    console.log('Scanning for Bluetooth LE Devices');
  }

  onDiscoveredDevice(device) {
    console.log('Discovered ' + JSON.stringify(device, null, 2));
    this.ngZone.run(() => {
      this.devices.push(device);
    });
  }

  deviceSelected(device) {
    console.log(JSON.stringify(device) + ' selected');
    this.navCtrl.push(DetailPage, {
      device: device
    });
  }

  setStatus(message) {
    console.log(message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  } 

  showAlert(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

}
