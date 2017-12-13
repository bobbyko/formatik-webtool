import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';
import { IStripeCheckoutToken } from 'ng-stripe-checkout/src/config.model';

@Injectable()
export class PaymentService {
  //static ENDPOINT: string =  "//payment.formatik.io";
  private static ENDPOINT = '//localhost:5000';

  constructor( @Inject(Http) private _http: Http) {

  }

  public checkout(token: IStripeCheckoutToken): Observable<any> {
    return this._http
      .post(
      `${PaymentService.ENDPOINT}/checkout`,
      {
        email: token.email,
        token: token.id
      })
      .map((r) => {
        return r.json();
      });
  }

  public validate(email: string, token: string): Observable<any> {
    return this._http
      .post(
      `${PaymentService.ENDPOINT}/validate`,
      {
        email: email,
        token: token
      })
      .map((r) => {
        return r.json();
      });
  }
}
