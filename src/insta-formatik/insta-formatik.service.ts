import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Http } from "@angular/http";

import { UUID } from 'angular2-uuid';
import { Md5 } from 'ts-md5/dist/md5';

import "rxjs/add/operator/map";import "rxjs/add/operator/map";

@Injectable()
export class InstaFormatikService {
  static ENDPOINT: string =  "https://api.formatik.io/v1.0";
  //static ENDPOINT: string = "http://localhost:5000/v1.0";
  static apiUserId: string = "59092f5f99da28278a6ea211";

  private inputCacheHashes: any = {};

  constructor( @Inject(Http) private _http: Http) {

  }

  evaluate(input: string, inputCacheId: string, example: string): Observable<any> {
    let inputCacheHash = inputCacheId ? this.inputCacheHashes[inputCacheId] : UUID.UUID();

    return this._http
      .post(
        `${InstaFormatikService.ENDPOINT}/${InstaFormatikService.apiUserId}/evaluate`,
        {
          name: `Webtool request ${Md5.hashStr(inputCacheHash + example)}`,
          input: input,
          inputCacheId: inputCacheId,
          example: example,
          temporary: true
        })
      .map((r) => { 
        let result = r.json();

        if (!this.inputCacheHashes[result.inputCacheId] && result.status === "OK")
          this.inputCacheHashes[result.inputCacheId] = inputCacheHash;

        return result;        
      });
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
