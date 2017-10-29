import { Component, ViewChild } from '@angular/core';
import { DefaultUrlSerializer } from '@angular/router';
import { Clipboard } from 'ts-clipboard';

import { Subject } from 'rxjs/Subject';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/startWith';

import { Angulartics2Mixpanel } from 'angulartics2';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie';

import { InstaFormatikService } from './insta-formatik.service';

@Component({
  selector: 'insta-formatik',
  templateUrl: './insta-formatik.component.html',
  styleUrls: ['insta-formatik.css']
})

export class InstaFormatikComponent {
  @ViewChild('fileUpload')
  public fileUpload: any;
  public isEmbedded: boolean;

  public input: string;
  public example: string;
  public autoevaluate: boolean;

  public inputCacheId: string;
  public evaluationInProgress: boolean;
  public evaluation: any;
  public processed: any;

  public inputChange: Subject<string>;
  public exampleChange: Subject<string>;

  constructor(
    private toastr: ToastrService,
    private _instaFormatikService: InstaFormatikService,
    private angulartics2Mixpanel: Angulartics2Mixpanel,
    private cookie: CookieService,
    private urlSerializer: DefaultUrlSerializer
  ) {
    this.isEmbedded = location.hash === '#embedded';

    this.evaluationInProgress = false;
    this.autoevaluate = false;

    this.inputChange = new Subject<string>();
    this.exampleChange = new Subject<string>();

    this.inputChange
      .debounceTime(1000)
      .subscribe(() => {
        if (this.autoevaluate && this.canEvaluate()) {
          this.evaluate();
        }
      });

    this.exampleChange
      .debounceTime(1000)
      .subscribe(() => {
        if (this.autoevaluate && this.canEvaluate()) {
          if (this.evaluation) {
            this.process();
          } else {
            this.evaluate();
          }
        }
      });

    // set user tracking
    const url = urlSerializer.parse(window.parent ? window.parent.location.href : location.href);
    const bt_userId = url.queryParams['bt'];

    let userId = this.cookie.get('userId');

    if (bt_userId && (!userId || userId !== bt_userId)) {
      userId = bt_userId;
      this.cookie.put('userId', userId);
    } else if (!bt_userId && !userId) {
      userId = Math.floor(Math.random() * 1000000000).toString();
      this.cookie.put('userId', userId);
    }

    this.angulartics2Mixpanel.setUsername(userId);
  }

  canEvaluate(): Boolean {
    return !this.evaluationInProgress &&
      this.input && this.input !== '' &&
      this.example && this.example !== '';
  }

  inputChanged(): void {
    this.inputCacheId = null;
    this.evaluation = null;
    this.processed = null;

    this.inputChange.next(this.input);
    this.exampleChange.next(this.evaluation);
  }

  exampleChanged(): void {
    this.evaluation = null;
    this.processed = null;

    this.exampleChange.next(this.evaluation);
  }

  evaluate(): void {
    this.evaluationInProgress = true;

    this._instaFormatikService
      .evaluate(this.inputCacheId ? null : this.input, this.inputCacheId, this.example)
      .subscribe(
      (evaluation) => {
        this.processed = null;

        if (evaluation.status === 'OK') {
          if (this.inputCacheId !== evaluation.inputCacheId) {
            this.inputCacheId = evaluation.inputCacheId;
          }

          this.evaluation = evaluation;
          this.process();
        } else {
          switch (evaluation.errorCode) {
            case 'InputCacheNotFound':
              this.inputCacheId = null;
              this.evaluate();
              break;

            default:
              this.evaluation = null;
              this.evaluationInProgress = false;
              this.toastr.warning(evaluation.error);
              break;
          }
        }
      },
      (error) => {
        this.evaluation = null;
        this.evaluationInProgress = false;
        this.toastr.error(error);
      });
  }

  process(): void {
    this.evaluationInProgress = true;

    if (this.evaluation.formatId) {
      this._instaFormatikService
        .process(this.evaluation.formatId, this.inputCacheId ? null : this.input, this.inputCacheId)
        .subscribe((processed) => {

          if (processed.status === 'OK') {
            if (this.inputCacheId !== processed.inputCacheId) {
              this.inputCacheId = processed.inputCacheId;
            }

            this.evaluationInProgress = false;
            this.processed = processed;

            this.angulartics2Mixpanel.eventTrack('process', { success: true });
          } else {
            switch (processed.errorCode) {
              case 'InputCacheNotFound':
                this.inputCacheId = null;
                this.process();
                break;

              default:
                this.processed = null;
                this.evaluationInProgress = false;
                this.toastr.warning(processed.error);
                this.angulartics2Mixpanel.eventTrack('process', { success: false, error: processed.error });
                break;
            }
          }
        },
        (error) => {
          this.processed = null;
          this.evaluationInProgress = false;
          this.toastr.error(error);
          this.angulartics2Mixpanel.eventTrack('process', { success: false, error: error });
        });
    } else {
      this.processed = null;
    }
  }

  copy(): void {
    const output = this.getProcessed();
    if (output && output !== '') {
      Clipboard.copy(output);
      this.toastr.info('Output copied.');
    }
  }

  getProcessed(): string {
    return this.processed && this.processed.status === 'OK' ? this.processed.result : '';
  }

  upload(): void {
    this.fileUpload.click();
  }
}
