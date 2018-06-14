// Angular core lib
import {
  Injector,
  NgModule,
  ApplicationRef,
  APP_INITIALIZER
} from '@angular/core';
import {
  removeNgStyles,
  createNewHosts,
  createInputTransfer
} from '@angularclass/hmr';
import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { environment, ENV_FIREBASE_CONFIG } from '../environments/environment';
import { AppState, InternalStateType } from './app.service';
import { AppReadyEvent } from './app-ready-event';
import { AppConfig } from './app.config';
import { HttpErrorInterceptor } from './utility/httpInterceptor';
// App core modules
import { CardModule } from './card/card.module';
import { SharedModule } from './shared/shared.module';
// App core components
import { AppComponent } from './app.component';
// App core routes
import { AppRoutingModule } from './app-routing.module';
// node_modules one-time load
// Translator
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
// Miscellaneous
import { Level, Log } from 'ng2-logger';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { logger } from 'codelyzer/util/logger';
import { MomentModule } from 'ngx-moment';
import { Notice } from './utility/notification';
import { BlockUIModule } from 'ng-block-ui';
import { FlexLayoutModule } from '@angular/flex-layout';
import '../styles/styles.scss';

const configurationParam = {
  withCredentials: true,
  basePath: environment.apiUrl
};

// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppState,
  Notice,
  AppReadyEvent,
  { provide: APP_BASE_HREF, useValue: '/' },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpErrorInterceptor,
    multi: true
  }
];

interface StoreType {
  state: InternalStateType;
  restoreInputValues: () => void;
  disposeOldHosts: () => void;
}

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CardModule,
    SharedModule,
    MomentModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    ToastrModule.forRoot({
      preventDuplicates: true,
      maxOpened: 1
    }),
    BlockUIModule.forRoot(),
    FlexLayoutModule

    /**
     * This section will import the `DevModuleModule` only in certain build types.
     * When the module is not imported it will get tree shaked.
     * This is a simple example, a big app should probably implement some logic
     */
    // ...environment.showDevModule ? [ DevModuleModule ] : [],
  ],
  /**
   * Expose our Services and Providers into Angular's dependency injection.
   */
  providers: [
    environment.ENV_PROVIDERS,
    APP_PROVIDERS,
    ToastrService,
  ]
})
export class AppModule {
  constructor(
    private injector: Injector,
    public appRef: ApplicationRef,
    public appState: AppState
  ) {
    // enable production mode in your app
    // Log.setProductionMode();
    Log.onlyModules('src:config');
    Log.onlyLevel(Level.ERROR, Level.WARN, Level.DATA, Level.INFO);
  }
}
