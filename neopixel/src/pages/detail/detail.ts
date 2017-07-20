import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';

// NeoPixel Service UUIDs
const NEOPIXEL_SERVICE = 'ccc0';
const COLOR = 'ccc1';
const BRIGHTNESS = 'ccc2';
const POWER_SWITCH = 'ccc3';

@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {

  peripheral: any = {};
  red: number;
  green: number;
  blue: number;
  brightness: number;
  power: boolean;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private ble: BLE,
              private toastCtrl: ToastController,
              private ngZone: NgZone) {
    let device = navParams.get('device');
    this.ble.connect(device.id).subscribe(
      peripheral => this.onConnected(peripheral),
      peripheral => this.onDeviceDisconnected(peripheral)
    );
  }

  onConnected(peripheral) {
    console.log('Connected to ' + peripheral.name + ' ' + peripheral.id);
    this.ngZone.run(() => {
      this.peripheral = peripheral;
    });

    // get the current values so we can sync the UI
    this.ble.read(peripheral.id, NEOPIXEL_SERVICE, COLOR).then(
      buffer => {
        var data = new Uint8Array(buffer);
        this.ngZone.run(() => {
          this.red = data[0];
          this.green = data[1];
          this.blue = data[2];
        });
      }
    );

    this.ble.read(peripheral.id, NEOPIXEL_SERVICE, BRIGHTNESS).then(
      buffer => {        
        var data = new Uint8Array(buffer);
        this.ngZone.run(() => {
          this.brightness = data[0];
        });
      }
    );

    this.ble.read(peripheral.id, NEOPIXEL_SERVICE, POWER_SWITCH).then(
      buffer => {
        var data = new Uint8Array(buffer);
        console.log('Read Power Switch. Result: ' + data[0]);
        this.ngZone.run(() => {
          this.power = data[0] !== 0;
        });
      }
    );

    // TODO read and notification should use the same handler
    this.ble.startNotification(peripheral.id, NEOPIXEL_SERVICE, POWER_SWITCH).subscribe(
      buffer => {
        var data = new Uint8Array(buffer);
        console.log('Received Notification: Power Switch = ' + data);
        this.ngZone.run(() => {
          this.power = data[0] !== 0;
        });
      }
    );

    // this.ble.startNotification(peripheral.id, NEOPIXEL_SERVICE, BRIGHTNESS).subscribe(
    //   buffer => {        
    //     var data = new Uint8Array(buffer);
    //     console.log('Received Notification: Brightness = ' + data[0]);
    //     this.ngZone.run(() => {
    //       this.brightness = data[0];
    //     });
    //   }
    // );
    
  }

  onDeviceDisconnected(peripheral) {
    let toast = this.toastCtrl.create({
      message: 'The peripheral unexpectedly disconnected',
      duration: 3000,
      position: 'center'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
      // TODO navigate back?
    });

    toast.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailPage');
  }

  ionViewWillLeave() {
    console.log('ionViewWillLeave disconnecting Bluetooth');
    this.ble.disconnect(this.peripheral.id).then(
      () => console.log('Disconnected ' + JSON.stringify(this.peripheral)),
      () => console.log('ERROR disconnecting ' + JSON.stringify(this.peripheral))
    )
  }

  setColor(event){

    console.log('setColor');
    let data = new Uint8Array([this.red, this.green, this.blue]);
    this.ble.write(this.peripheral.id, NEOPIXEL_SERVICE, COLOR, data.buffer).then(
      () => console.log('Updated color'),
      () => console.log('Error updating color')
    );

  }

  setBrightness(event){

    console.log('setBrightness');
    let data = new Uint8Array([this.brightness]);
    this.ble.write(this.peripheral.id, NEOPIXEL_SERVICE, BRIGHTNESS, data.buffer).then(
      () => console.log('Updated brightness'),
      () => console.log('Error updating brightness')
    );

  }

  onPowerSwitchChange(event) {
    
    console.log('onPowerSwitchChange');
    let value = this.power ? 1 : 0;
    let data = new Uint8Array([value]);
    console.log('Power Switch Property ' + this.power);
    this.ble.write(this.peripheral.id, NEOPIXEL_SERVICE, POWER_SWITCH, data.buffer).then(
      () => {
        console.log('Updated power switch')
        if (this.power && this.brightness === 0) {
          this.brightness = 0x3f; // cheating, should rely on notification
        }
      },
      () => console.log('Error updating  power switch')
    );

  }

}
