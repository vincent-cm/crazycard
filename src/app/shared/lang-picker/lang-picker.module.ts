import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LangPickerComponent } from './lang-picker.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatSelectModule } from '@angular/material';
import { SupportLang } from './support-lang/support-lang';

@NgModule({
  imports: [
    CommonModule,
    MatSelectModule,
    TranslateModule.forChild()
  ],
  exports: [LangPickerComponent],
  declarations: [LangPickerComponent],
  providers: [TranslateService, SupportLang],
})
export class LangPickerModule { }
