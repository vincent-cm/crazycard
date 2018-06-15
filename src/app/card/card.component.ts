import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
  OnDestroy,
  Inject
} from '@angular/core';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { Log } from 'ng2-logger';
import { TableColumn } from '@swimlane/ngx-datatable';
// import { BlockUI, NgBlockUI } from 'ng-block-ui';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  AUTOCOMPLETE_OPTION_HEIGHT
} from '@angular/material';
import { UserSearchComponent } from './user-search/user-search.component';
import { of, zip, empty } from 'rxjs';
import { environment } from 'environments/environment';
import { AttrPriorityPipe } from 'app/utility/priority.pipe';
import { KeysPipe } from 'app/utility/keys.pipe';
import { Notice } from 'app/utility/notification';
import { Util } from 'app/utility/tools';
import { Card } from 'app/card/_models';
import { CardService } from './_services/card.service';
import { ResourceId } from 'app/shared/i18n/resource-id';
import { TranslateService } from '@ngx-translate/core';
import { catchError } from 'rxjs/operators';
import { ViewContainerRef } from '@angular/core';
import { AlertComponent } from './_directives';
import { ComponentFactoryResolver } from '@angular/core';
import { AlertService } from './_services';

const log = Log.create('card.component');
log.color = '#a2007a';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent
  implements OnInit, AfterViewInit, OnDestroy, AfterViewChecked {
  // @BlockUI('card_list') blockUI: NgBlockUI;
  @ViewChild('alertCardResult', { read: ViewContainerRef })
  alertCardResult: ViewContainerRef;
  public cardList: Card[] = [];
  public selectedCardList: Card[] = [];
  public cardColumns: TableColumn[] = [];
  public isLoading: boolean;
  public checkboxColumn: TableColumn = {
    canAutoResize: false,
    checkboxable: true,
    draggable: false,
    frozenLeft: true,
    headerCheckboxable: true,
    resizeable: false,
    sortable: false,
    width: 55
  };

  public customPriority = [
    'NAME',
    'DESCRIPTION',
    'APR',
    'BALANCETRANSFEROFFERDUATION',
    'PURCHASEOFFERDURATION',
    'CREDIT'
  ];
  public cardAttrList: any;
  public totalCredit = 0;
  public totalCreditSelected = 0;
  public tableMessage: any = {};
  public tableMessageMap: any = {};
  constructor(
    private activatedRoute: ActivatedRoute,
    private cardService: CardService,
    private elRef: ElementRef,
    public matDialog: MatDialog,
    public notice: Notice,
    private _alertService: AlertService,
    public translate: TranslateService,
    private cfr: ComponentFactoryResolver
  ) {
    this.tableMessageMap = {
      'DATATABLE.emptyMessage': 'emptyMessage',
      'DATATABLE.totalMessage': 'totalMessage'
    };

    const translateDataTableKeys: Array<string> = [];
    for (const obj of Object.keys(ResourceId.DATATABLE)) {
      translateDataTableKeys.push(ResourceId.DATATABLE[obj]);
    }

    this.translate.get(translateDataTableKeys).subscribe(res => {
      console.log('data table translate');
      Object.keys(res).forEach((key, idx) => {
        const newKey = this.tableMessageMap[key] || key;
        this.tableMessage[newKey] = res[key];
      });
    });
  }

  ngOnInit() {
    // initial the data table
    this.checkboxColumn = {
      canAutoResize: false,
      checkboxable: true,
      draggable: false,
      frozenLeft: true,
      headerCheckboxable: true,
      resizeable: false,
      sortable: false,
      width: 55
    };
  }

  public onRowClick(event) {
    console.log('Activate Event', event);

    if (
      event.type === 'click' &&
      (event.column && !event.column.checkboxable)
    ) {
      this.showQuickDetail(event.row);
    }
  }

  public showQuickDetail(card: Card) {
    const dialogRef = this.matDialog.open(CardDetailComponent, {
      width: '800px',
      data: card
    });
  }

  public ngOnDestroy() { }

  ngAfterViewInit() { }

  public onShowUserPopup() {
    const dialogRef = this.matDialog
      .open(UserSearchComponent, {
        id: 'user-search-component',
        width: '900px',
        data: { action: 'search', data: null }
      })
      .afterClosed()
      .subscribe(result => {
        if (result && result.action === 'search') {
          log.info(JSON.stringify(result));
          this.isLoading = true;
          // this.blockUI.start('Loading...');
          this.cardService
            .searchCard(result.data)
            .pipe(
              catchError(error => {
                this.isLoading = false;
                // this.blockUI.stop();
                this.showAlert('alertUserInput');
                this._alertService.error(error);
                return empty();
              })
            )
            .subscribe(resData => {
              log.info('searchCard', resData);
              if (resData.error === 0) {
                this.cardList = resData.result.list;
                this.totalCredit = resData.result.totalCredit;
                this.cardAttrList = new KeysPipe().transform(
                  new Card(),
                  true,
                  false,
                  true,
                  this.customPriority
                );
                this.cardColumns = [
                  this.checkboxColumn,
                  ...this.cardAttrList
                    .filter(el => {
                      return el && ['name', 'apr', 'credit'].includes(el);
                    })
                    .map(el => {
                      return {
                        name: this.translate.instant(
                          'CARD.' + el.toUpperCase()
                        ),
                        prop: el
                      } as TableColumn;
                    })
                ];

                log.info('this.cardColumns' + this.cardColumns);
                console.dir(this.cardColumns);

                // check whether applicationId in the parameter
                // this.blockUI.stop();
                this.isLoading = false;
              } else {
                this.notice.warn(resData.message);
                // this.blockUI.stop();
                this.isLoading = false;
              }
            });
        }
      });
  }

  public onClear() {
    this.cardList = [];
    this.totalCredit = 0;
    this.totalCreditSelected = 0;
  }

  public onCardsSelected({ selected }) {
    log.info('onCardsSelected selected', selected);
    log.info('onCardsSelected selectedCardList', this.selectedCardList);
    if (Array.isArray(selected) && selected.length !== 0) {
      const selectedCreditReduced = selected.reduce((a, b) => ({
        credit: a.credit + b.credit
      }));
      selectedCreditReduced
        ? (this.totalCreditSelected = selectedCreditReduced['credit'])
        : (this.totalCreditSelected = 0);
    } else {
      this.totalCreditSelected = 0;
    }
  }

  public openGitHub() {
    window.location.href = 'https://github.com/vincent-cm';
  }

  public ngAfterViewChecked() { }

  showAlert(target) {
    this[target].clear();
    const factory = this.cfr.resolveComponentFactory(AlertComponent);
    const ref = this[target].createComponent(factory);
    ref.changeDetectorRef.detectChanges();
  }
}

@Component({
  selector: 'card-overview-dialog',
  templateUrl: 'card-overview-dialog.html'
})
export class CardDetailComponent {
  constructor(
    public dialogRef: MatDialogRef<CardDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log('data opened');
    console.log(JSON.stringify(data));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
