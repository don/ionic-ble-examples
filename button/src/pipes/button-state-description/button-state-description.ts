import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'buttonStateDescription',
})
export class ButtonStateDescriptionPipe implements PipeTransform {
  /**
   * Translate the button state into a description
   */
  transform(buttonState: number, ...args) {

    let description;

    // TODO get code from SensorTag for multiple buttons
    if (buttonState === 0) {
      description = 'Button is Released';
    } else if (buttonState) {
      description = 'Button is Pressed';
    } else {
      description = 'Button State is Unknown';
    }

    return description;
  }
}
