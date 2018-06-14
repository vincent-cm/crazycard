import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LANGUAGES, LANGUAGES_KEYS } from './support-lang/support-lang';
import { Log } from 'ng2-logger';
import { LOG_ENTRIES } from '../log-helper/log-helper.service';

// logger
const log = Log.create(LOG_ENTRIES.lang_picker.name);
log.color = LOG_ENTRIES.lang_picker.color;

@Component({
  selector: 'app-lang-picker',
  templateUrl: './lang-picker.component.html',
  styleUrls: ['./lang-picker.component.scss']
})
export class LangPickerComponent implements OnInit {

  get languages() {
    return LANGUAGES;
  }

  get languagesKeys() {
    return LANGUAGES_KEYS;
  }

  constructor(public translate: TranslateService) {
  }

  ngOnInit() {
    // in order to show initial language in picker, change language and change back to update UI
    // TODO: need to find other better solution or report bug for Angular Material.
    const temp = this.translate.currentLang;
    this.translate.use('en');
    this.translate.use(temp);
  }

  /**
   * language change
   */
  onLanguageChange(lang) {
    log.info('onLanguageChange: ', lang);
    this.translate.use(lang);
  }
}
