import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';

import { UUID } from 'angular2-uuid';
import { Md5 } from 'ts-md5/dist/md5';

import 'rxjs/add/operator/map';

@Injectable()
export class FormatikService {
  static ENDPOINT: string =  '//api.formatik.io/v1.0';
  //private static ENDPOINT = '//localhost:5000/v1.0';
  private static apiUserId = '59092f5f99da28278a6ea211';

  private inputCacheHashes: any = {};

  constructor( @Inject(Http) private _http: Http) {

  }

  public evaluate(input: string, inputCacheId: string, example: string): Observable<any> {
    const inputCacheHash = inputCacheId ? this.inputCacheHashes[inputCacheId] : UUID.UUID();

    return this._http
      .post(
      `${FormatikService.ENDPOINT}/${FormatikService.apiUserId}/evaluate`,
      {
        name: `Webtool request ${Md5.hashStr(inputCacheHash + example)}`,
        input: input,
        inputCacheId: inputCacheId,
        example: example,
        temporary: true
      })
      .map((r) => {
        const result = r.json();

        if (!this.inputCacheHashes[result.inputCacheId] && result.status === 'OK') {
          this.inputCacheHashes[result.inputCacheId] = inputCacheHash;
        }

        return result;
      });
  }

  public process(formatId: string, input: string, inputCacheId: string): Observable<any> {
    return this._http
      .post(
      `${FormatikService.ENDPOINT}/${FormatikService.apiUserId}/${formatId}`,
      {
        input: input,
        inputCacheId: inputCacheId
      })
      .map((r) => r.json());
  }

  public GetUploadUrl(): string {
    return `${ FormatikService.ENDPOINT }/${FormatikService.apiUserId}/upload`;
  }
}
