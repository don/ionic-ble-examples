import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { BLE } from '@ionic-native/ble';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { DetailPage } from '../pages/detail/detail';
import { FormatTemperaturePipe } from '../pipes/format-temperature/format-temperature';
import { FormatTemperatureCPipe } from '../pipes/format-temperature-c/format-temperature-c';
import { FormatTemperatureFPipe } from '../pipes/format-temperature-f/format-temperature-f';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    DetailPage,
    FormatTemperaturePipe,
    FormatTemperatureCPipe,
    FormatTemperatureFPipe
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    DetailPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BLE
  ]
})
export class AppModule {}
