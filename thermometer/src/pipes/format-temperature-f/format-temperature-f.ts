import { Pipe, PipeTransform } from '@angular/core';

/**
 * Take raw Celsius value and return formatted string with as ° Fahrenheit
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'formatTemperatureF',
})
export class FormatTemperatureFPipe implements PipeTransform {

  transform(celsius: number, ...args) {
    if (celsius === undefined) {
      return '???';
    }

    let fahrenheit = this.toFahrenheit(celsius);

    return fahrenheit.toFixed(1) + '°F';

  }

  toFahrenheit(celsius: number): number {
    var fahrenheit = (celsius * 1.8 + 32.0);
    return fahrenheit;
  }
}
