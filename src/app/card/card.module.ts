import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BaseRequestOptions, HttpModule } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { BlockUIModule } from 'ng-block-ui';
import { CardRoutingModule } from './card-routing.routing';
import { CardComponent, CardDetailComponent } from './card.component';
import { AlertComponent } from './_directives/alert.component';
import { AlertService } from './_services/alert.service';
import { CardService } from './_services/card.service';
import { fakeBackendProvider } from './_helpers/index';
import { SharedModule } from '../shared/shared.module';
import { AttrPriorityPipe } from '../utility/priority.pipe';
import { KeysPipe } from 'app/utility/keys.pipe';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UserSearchComponent } from './user-search/user-search.component';
import { MAT_DIALOG_DATA } from '@angular/material';

@NgModule({
  declarations: [
    CardComponent,
    CardDetailComponent,
    AlertComponent,
    UserSearchComponent,
    AttrPriorityPipe,
    KeysPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    CardRoutingModule,
    SharedModule,
    NgxDatatableModule,
    BlockUIModule
  ],
  providers: [
    AlertService,
    CardService,
    // api backend simulation
    fakeBackendProvider,
    MockBackend,
    BaseRequestOptions
  ],
  entryComponents: [AlertComponent, UserSearchComponent, CardDetailComponent]
})
export class CardModule { }
