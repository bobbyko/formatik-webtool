import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, DefaultUrlSerializer } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { WebtoolComponent } from './webtool.component';
import { ModalComponent } from './modal.component';
import { FormatikService } from './formatik.service';
import { PaymentService } from './payment.service';


// 3rd party modules
import { Md5 } from 'ts-md5/dist/md5';
import { Angulartics2Module } from 'angulartics2';
import { Angulartics2Mixpanel } from 'angulartics2/mixpanel';
import { CookieModule } from 'ngx-cookie';
import { ToastrModule } from 'ngx-toastr';
import { AlertModule } from 'ngx-bootstrap';
import { FileUploadModule } from 'ng2-file-upload';
import { NgProgressModule } from 'ngx-progressbar';
import { StripeCheckoutModule } from 'ng-stripe-checkout';
import { TooltipModule } from 'ngx-tooltip';

@NgModule({
  declarations: [
    WebtoolComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot([]),
    BrowserAnimationsModule,
    Angulartics2Module.forRoot([Angulartics2Mixpanel]),
    CookieModule.forRoot({
      domain: 'formatik.io',
      expires: new Date('1/1/2020')
    }),
    ToastrModule.forRoot({
      timeOut: 7000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      closeButton: true
    }),
    AlertModule.forRoot(),
    FileUploadModule,
    NgProgressModule,
    StripeCheckoutModule,
    TooltipModule
  ],
  providers: [DefaultUrlSerializer, FormatikService, PaymentService],
  bootstrap: [WebtoolComponent]
})
export class WebtoolModule { }
