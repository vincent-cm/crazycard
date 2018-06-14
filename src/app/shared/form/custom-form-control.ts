/*
* This class is custom FormControl with more feature
 */
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ResourceId } from '../i18n/resource-id';

export const CustomFormControlSupportErrors = {
  required: 'required',
  pattern: 'pattern'
};

/**
 * The general form control with validation message.
 * @class RegisterFormGroup
 */
export class CustomFormControl extends FormControl {
  // label information of control support i18n
  label: string;
  // model name to the form control which used to bind the data
  modelProperty: string;
  // the type of the FormControl such as 'text' 'password' 'email'
  type = 'text';

  constructor(
    label: string,
    property: string,
    value: any,
    validator: any,
    protected translate: TranslateService,
    type?: string
  ) {
    super(value, validator);
    this.label = label;
    this.modelProperty = property;
    this.type = type;
  }

  /**
   * Get the validation message by different error.
   * @returns {string[]}
   */
  getValidationMessages(): string[] {
    // console.log('getValidationMessages current language: ' + this.translate.currentLang);

    const messages: string[] = [];
    if (this.errors) {
      // console.log('getValidationMessages');
      // console.log(this.errors);
      for (const errorName in this.errors) {
        if (errorName) {
          switch (errorName) {
            case CustomFormControlSupportErrors.required:
              this.translate
                .get(ResourceId.VALIDATION.REQUIRED, { label: this.label })
                .subscribe((res: string) => {
                  // console.log(res);
                  messages.push(res);
                });
              break;
            case CustomFormControlSupportErrors.pattern:
              this.translate
                .get(ResourceId.VALIDATION.PATTERN, { label: this.label })
                .subscribe((res: string) => {
                  // console.log(res);
                  messages.push(res);
                });
              break;
          }
        }
      }
    }
    return messages;
  }
}
