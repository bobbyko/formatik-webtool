import {
  Inject,
  Injectable
} from "@angular/core";

import {
  Observable
} from "rxjs/Observable";

import {
  Http,
  Headers
} from "@angular/http";

import {
  UUID
} from 'angular2-uuid';

import "rxjs/add/operator/map";

@Injectable()
export class InstaFormatikService {
  static sessionId = UUID.UUID();
  static ENDPOINT: string =  "https://api.formatik.io/v1.0";
  //static ENDPOINT: string = "http://localhost:5000/v1.0";
  static apiUserId: string = "59092f5f99da28278a6ea211";

  constructor( @Inject(Http) private _http: Http) {

  }

  evaluate(input: string, inputCacheId: string, example: string): Observable<any> {
    return this._http
      .post(
        `${InstaFormatikService.ENDPOINT}/${InstaFormatikService.apiUserId}/evaluate`,
        {
          name: `Webtool request ${InstaFormatikService.sessionId}`,
          input: input,
          inputCacheId: inputCacheId,
          example: example,
          temporary: true
        })
      .map((r) => r.json());
  }

  process(formatId: string, input: string, inputCacheId: string): Observable<any> {
    return this._http
      .post(
        `${InstaFormatikService.ENDPOINT}/${InstaFormatikService.apiUserId}/${formatId}`,
        {
          input: input,
          inputCacheId: inputCacheId
        })
      .map((r) => r.json());
  }
}
