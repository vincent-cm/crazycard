import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { environment } from 'environments/environment';
import { AppState } from './app.service';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LogHelperService } from './shared/log-helper/log-helper.service';
import { SupportLang } from './shared/lang-picker/support-lang/support-lang';

@Component({
  selector: 'body',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  title = 'app';
  constructor(
    private _router: Router,
    private logHelper: LogHelperService,
    public supportLang: SupportLang
  ) {
    logHelper.iniLoggerConfig();
    supportLang.initialLang();
  }

  ngOnInit() {
    this._router.events.subscribe(route => {
      console.log('Router event:', route);
    });
  }
}
