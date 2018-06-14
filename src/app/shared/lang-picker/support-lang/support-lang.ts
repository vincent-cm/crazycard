import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Log } from 'ng2-logger';
import { LOG_ENTRIES } from '../../log-helper/log-helper.service';

// logger
const log = Log.create(LOG_ENTRIES.lang_picker.name);
log.color = LOG_ENTRIES.lang_picker.color;

export interface Lang {
  key: string;
  value: string;
  viewValue: string;
  isDefault?: boolean;
}

export const LANGUAGES: { [key: string]: Lang } = {
  'en': {
    key: 'en',
    value: 'en',
    viewValue: 'LANGUAGE.EN',
  },
  'en-gb': {
    key: 'en-gb',
    value: 'en-gb',
    viewValue: 'LANGUAGE.EN-GB',
  }
};

export const LANGUAGES_KEYS = Object.keys(LANGUAGES);

@Injectable()
export class SupportLang {

  constructor(private translate: TranslateService) { }

  initialLang() {
    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang('en');
    // add language based on the LANGUAGES and get the regexp to filter browser language
    let regexp = '/';
    for (const obj of LANGUAGES_KEYS) {
      this.translate.addLangs([LANGUAGES[obj].value]);
      regexp = regexp.concat(LANGUAGES[obj].value, '|');
    }
    regexp = regexp.concat('/');
    // get the culture language code name from the browser, e.g. "de-DE"
    const browserLang = this.translate.getBrowserCultureLang().toLowerCase();
    log.info('Current browserLang is ', browserLang);
    log.info('Current regexp ', regexp);
    // if the browser language is matched with one of existing language, use it, or use en
    this.translate.use(browserLang.match(regexp) ? browserLang : 'en');
    log.info('Current language is ', this.translate.currentLang.toString());
  }
}
