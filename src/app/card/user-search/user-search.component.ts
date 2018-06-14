import {
  Component,
  ComponentFactoryResolver,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
  OnDestroy,
  Inject
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { CardService } from '../_services/card.service';
import { AlertService } from '../_services/alert.service';
import { AlertComponent } from '../_directives/alert.component';
import { Log } from 'ng2-logger';
import { User, User_Enum } from '../_models/user';
import { Card } from '../_models/card';
import { of, empty } from 'rxjs';
import { delay, catchError } from 'rxjs/operators';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { DataService, SharedData } from '../../shared/data.service';
import { environment } from 'environments/environment';
import { Notice } from 'app/utility/notification';
import { KeysPipe } from 'app/utility/keys.pipe';
import { UserSearchFormGroup } from './user-search-form-group';
import { ResourceId } from 'app/shared/i18n/resource-id';
import { TranslateService } from '@ngx-translate/core';
declare let $: any;
declare let mUtil: any;

const log = Log.create('UserSearchComponent');
log.color = '#15a850';

// noinspection TsLint
@Component({
  selector: 'app-user-search',
  styleUrls: ['./user-search.component.scss'],
  templateUrl: './user-search.component.html',
  encapsulation: ViewEncapsulation.None
})
export class UserSearchComponent implements OnInit, OnDestroy {
  @BlockUI('user-search') blockUI: NgBlockUI;
  public itemsPerRow: number;
  public rows: number[];
  public isInEdit: boolean;
  public isLoading: boolean;
  public User_Enum = User_Enum;
  public JSObject: object = Object;
  public customPriority = [
    'TITLE',
    'FIRSTNAME',
    'LASTNAME',
    'DOB',
    'INCOME',
    'EMPLOYMENT',
    'HOUSENUMBER',
    'POSTCODE'
  ];

  @ViewChild('alertUserInput', { read: ViewContainerRef })
  alertUserInput: ViewContainerRef;

  userFormGroup: UserSearchFormGroup;
  userAttrList: any;
  startDate = new Date(1990, 0, 1);
  maxDate = new Date();

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _alertService: AlertService,
    private cfr: ComponentFactoryResolver,
    private dataService: DataService,
    private fb: FormBuilder,
    public notice: Notice,
    public dialogRef: MatDialogRef<UserSearchComponent>,
    @Inject(MAT_DIALOG_DATA) public userSearchModalInput: any,
    public translate: TranslateService
  ) {
    const keys: Array<string> = Object.keys(ResourceId.USER);
    const translateKeys: Array<string> = [];
    for (const obj of keys) {
      translateKeys.push(ResourceId.USER[obj]);
    }
    log.info('translateKeys: ');
    log.info(translateKeys.toString());
    const temp: Array<string> = translateKeys;
    this.translate.get(temp).subscribe((res: string) => {
      log.info('get the translation:');
      log.info(res);
      this.userFormGroup = new UserSearchFormGroup(translate, res);
    });

    this.isInEdit = true;
    this.itemsPerRow = 2;

    // Generating ordered attributes list with scalable User model
    this.userAttrList = new KeysPipe().transform(
      new User(),
      true,
      false,
      true,
      this.customPriority
    );
    log.info(JSON.stringify(this.userAttrList));

    this.calculateDomRows();
    this.updateUserInputForm();
  }

  // Generating Row numbers for two fields per line input group
  calculateDomRows() {
    this.rows = Array.from(
      Array(Math.ceil(this.userAttrList.length / this.itemsPerRow)).keys()
    );
  }

  // Generating form controls
  updateUserInputForm() {
    const value = {};
    for (const property of this.userAttrList) {
      value[property] = {
        value: null,
        disabled: this.isInEdit ? false : true
      };
    }
    this.userFormGroup.reset(value);
  }

  // Cleaning form fields
  onRevert() {
    this.isInEdit = true;
    this.calculateDomRows();
    this.updateUserInputForm();
  }

  onSearch() {
    this.isLoading = true;
    this.blockUI.start('Assessing your profile...');
    const userSearchInput = this.userFormGroup.getRawValue();
    of('Fake collecting UI data')
      .pipe(delay(2000))
      .pipe(
        catchError(error => {
          this.isLoading = false;
          this.blockUI.stop();
          this.showAlert('alertUserInput');
          this._alertService.error(error);
          return empty();
        })
      )
      .subscribe(() => {
        log.info('onSearch', userSearchInput);
        this.blockUI.stop();
        this.isLoading = false;
        this.isInEdit = false;
        this.dialogRef.close({ action: 'search', data: userSearchInput });
      });
  }

  onDismiss(): void {
    this.isInEdit = false;
    this.dialogRef.close();
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.isInEdit = false;
    // this.dialogRef.close();
  }

  showAlert(target) {
    this[target].clear();
    const factory = this.cfr.resolveComponentFactory(AlertComponent);
    const ref = this[target].createComponent(factory);
    ref.changeDetectorRef.detectChanges();
  }
}
