import { Pipe, PipeTransform } from '@angular/core';

/**
 * Take raw Celsius value and return formatted string with Celsius and Fahrenheit
 */
@Pipe({
  name: 'formatTemperature',
})
export class FormatTemperaturePipe implements PipeTransform {

  transform(celsius: number, ...args) {
 
    if (celsius === undefined) {
      return '???';
    }
    let fahrenheit = this.toFahrenheit(celsius);

    return celsius.toFixed(1) + '°C ' + fahrenheit.toFixed(1) + '°F';
  }

  toFahrenheit(celsius: number): number {
    var fahrenheit = (celsius * 1.8 + 32.0);
    return fahrenheit;
  }
}
