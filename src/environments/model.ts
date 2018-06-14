import { NgModuleRef } from '@angular/core';

export interface Environment {
  production: boolean;
  apiUrl: string;
  ENV_PROVIDERS: any;
  showDevModule: boolean;
  decorateModuleRef(modRef: NgModuleRef<any>): NgModuleRef<any>;
}
