import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick
} from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of, zip, empty, Observable } from 'rxjs';

import { SharedModule } from '../shared/shared.module';
import { CardModule } from '../card/card.module';

import { CardComponent } from './card.component';
import { UserSearchComponent } from './user-search/user-search.component';

import { CardService } from './_services/card.service';

import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CustomFormControl } from '../shared/form/custom-form-control';

import { Card, User } from 'app/card/_models';
import { mockUser1, mockUser2, mockUser3 } from 'app/card/user-data.mock.spec';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

class MatDialogMock {
  open() {
    return {
      afterClosed: () => of({ action: 'search', data: mockUser1 })
    };
  }
}

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;
  let translateService: TranslateService;
  let debugElement: DebugElement;
  let element: HTMLElement;

  let cardService: CardService;
  let dialog: MatDialogMock;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, CardModule, ReactiveFormsModule, FormsModule],
      declarations: [CardComponent],
      providers: [
        TranslateService,
        {
          provide: MatDialog,
          useClass: MatDialogMock
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    // add supported language to the translate service
    translateService = TestBed.get(TranslateService);
    translateService.addLangs(['EN', 'en-GB']);

    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    element = debugElement.nativeElement;

    cardService = TestBed.get(cardService);
    dialog = TestBed.get(MatDialog);
    fixture.detectChanges();
  });

  it('when card component create, the group form should create with english translated label', () => {
    translateService.use('EN');
    fixture.detectChanges();

    // component initial successfully.
    expect(component).toBeTruthy();
    // get all label of the form
    const titles = debugElement.queryAll(By.css('mat-card-title'));
    // there should be 7 filed in the form.
    expect(titles.length).toBe(2);
    // the field text should be Chinese
    expect(titles[0].nativeNode.innerHTML).toBe('Total Credit You Can Get: £0');
    expect(titles[1].nativeNode.innerHTML).toBe(
      'Total Credit You Selected: £0'
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(
    'template should show buttons',
    fakeAsync(() => {
      const buttons = debugElement.queryAll(By.css('.mat-button'));
      expect(buttons.length).toBe(3);

      const searchBtnText = debugElement.query(
        By.css('.mat-button .mat-accent')
      ).nativeElement.textContent;
      const clearBtnText = debugElement.query(By.css('.mat-button .mat-white'))
        .nativeElement.textContent;

      expect(searchBtnText).toBe('Get A Quick & Easy Quote Now‎');
      expect(clearBtnText).toBe('Clear');
    })
  );

  it(
    'should call onSearch, MatDialog should be open & call cardService.search after Edit button is clicked and MatDialog closed',
    fakeAsync(() => {
      /*
      Fake events when user data is filled in and bind to the dialog close action
      */
      spyOn(dialog, 'open').and.callThrough();
      spyOn(cardService, 'searchCard').and.callThrough();

      // to mock the quote button clicked in card component

      const quoteButton = debugElement.query(By.css('.mat-button .mat-accent'));
      quoteButton.triggerEventHandler('click', null);

      expect(dialog.open).toHaveBeenCalled();
      expect(cardService.searchCard).toHaveBeenCalledWith(mockUser1);
    })
  );
});
