import { Pipe, PipeTransform } from '@angular/core';

import { I18N_DICTIONARY } from './i18n.tokens';

@Pipe({
  name: 'i18n',
  standalone: true
})
export class I18nPipe implements PipeTransform {
  transform(value: string): string {
    return I18N_DICTIONARY[value] ?? value;
  }
}
