import { CustomFormControl } from '../../shared/form/custom-form-control';
import { FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ResourceId } from '../../shared/i18n/resource-id';
import { User } from '../_models/user';
import { KeysPipe } from '../../utility/keys.pipe';

export class UserSearchFormGroup extends FormGroup {
  constructor(
    protected translate: TranslateService,
    private userSearchFormLabel: any
  ) {
    super({});
    const user = new User();
    const userAttributes = new KeysPipe().transform(user, true, false, true);
    userAttributes.forEach(key => {
      super.addControl(
        key,
        new CustomFormControl(
          userSearchFormLabel['USER.SEARCHING.' + key.toUpperCase()],
          key,
          '',
          Validators.required,
          translate,
          typeof user[key] === 'string'
            ? 'text'
            : typeof user[key] === 'number'
              ? 'number'
              : ''
        )
      );
    });
    // super.addControl
  }

  get customControls(): CustomFormControl[] {
    return Object.keys(this.controls).map(
      k => this.controls[k] as CustomFormControl
    );
  }

  getFormValidationMessages(form: any): string[] {
    const messages: string[] = [];
    this.customControls.forEach(c =>
      c.getValidationMessages().forEach(m => messages.push(m))
    );
    return messages;
  }
}
