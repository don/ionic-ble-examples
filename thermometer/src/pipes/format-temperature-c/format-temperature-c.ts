import { Pipe, PipeTransform } from '@angular/core';

/**
 * Take raw Celsius value and return formatted string with °C
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'formatTemperatureC',
})
export class FormatTemperatureCPipe implements PipeTransform {

  transform(celsius: number, ...args) {
    if (celsius === undefined) {
      return '???';
    }

    return celsius.toFixed(1) + '°C';
  }
}
