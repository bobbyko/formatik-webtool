import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, DefaultUrlSerializer } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { InstaFormatikComponent } from './insta-formatik.component';
import { InstaFormatikService } from './insta-formatik.service';


// 3rd party modules
import { Md5 } from 'ts-md5/dist/md5';
import { Angulartics2Module, Angulartics2Mixpanel } from 'angulartics2';
import { CookieModule } from 'ngx-cookie';
import { ToastrModule } from 'ngx-toastr';
import { AlertModule } from 'ngx-bootstrap';

@NgModule({
  declarations: [
    InstaFormatikComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
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
    AlertModule.forRoot()
  ],
  providers: [DefaultUrlSerializer, InstaFormatikService],
  bootstrap: [InstaFormatikComponent]
})
export class InstaFormatikModule { }
