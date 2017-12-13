import { Component, ViewChild, OnInit, AfterViewInit, ElementRef, Renderer } from '@angular/core';
import { DefaultUrlSerializer } from '@angular/router';
import { Clipboard } from 'ts-clipboard';
import { FileItem, FileUploader, ParsedResponseHeaders } from 'ng2-file-upload';
import { TooltipModule } from 'ngx-tooltip';

import { Subject } from 'rxjs/Subject';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/startWith';

import { FormatikService } from './formatik.service';
import { PaymentService } from './payment.service';

import { Angulartics2Mixpanel } from 'angulartics2/mixpanel';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie';
import { NgProgress } from 'ngx-progressbar';
import { StripeCheckoutLoader, StripeCheckoutHandler } from 'ng-stripe-checkout';
import { IStripeCheckoutToken } from 'ng-stripe-checkout/src/config.model';
import * as moment from 'moment';

const tokenCookie = 'unlimited-processing-token';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'webtool',
  styleUrls: ['webtool.css'],
  templateUrl: './webtool.component.html'
})

export class WebtoolComponent implements OnInit, AfterViewInit {
  private stripeCheckoutHandler: StripeCheckoutHandler;

  public uploader: FileUploader;

  public isEmbedded: boolean;

  public input: string;
  public example: string;
  public autoevaluate: boolean;
  public inputFormat: string;
  public size: number;
  public records: number;
  public trunkated: boolean;

  public inputCacheId: string;
  public evaluationInProgress: boolean;
  public evaluation: any;
  public processed: any;

  public inputChange: Subject<string>;
  public exampleChange: Subject<string>;

  // existing token re-entry
  public email: string;
  public token: string;

  public processing: boolean;

  constructor(
    private el: ElementRef,
    private renderer: Renderer,
    private toastr: ToastrService,
    private formatikService: FormatikService,
    private paymentService: PaymentService,
    private angulartics2Mixpanel: Angulartics2Mixpanel,
    private cookie: CookieService,
    private urlSerializer: DefaultUrlSerializer,
    private stripeCheckoutLoader: StripeCheckoutLoader,
    public ngProgress: NgProgress,
  ) {
    this.evaluationInProgress = false;
    this.autoevaluate = false;
  }

  ngOnInit() {
    this.isEmbedded = location.hash === '#embedded';

    this.uploader = new FileUploader({ url: this.formatikService.GetUploadUrl() });
    this.uploader.onSuccessItem = this.uploadSuccess;
    this.uploader.onErrorItem = this.uploadError;
    (this.uploader as any).parent = this;

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
    const url = this.urlSerializer.parse(window.parent ? window.parent.location.href : location.href);
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

    this.token = this.cookie.get(tokenCookie);
  }

  async ngAfterViewInit() {
    this.stripeCheckoutHandler = await this.stripeCheckoutLoader.createHandler({
      key: 'pk_test_XdsAFsL8cqtxomVYKyJgdwyQ',
      allowRememberMe: true,
      token: this.onToken
    });
  }

  canEvaluate(): Boolean {
    return !this.evaluationInProgress &&
      this.input && this.input !== '' &&
      this.example && this.example !== '';
  }

  inputChanged(): void {
    this.inputCacheId = undefined;
    this.evaluation = undefined;
    this.processed = undefined;

    this.inputChange.next(this.input);
    this.exampleChange.next(this.evaluation);
  }

  exampleChanged(): void {
    this.evaluation = undefined;
    this.processed = undefined;

    this.exampleChange.next(this.evaluation);
  }

  evaluate(): void {
    this.evaluationInProgress = true;

    this.formatikService
      .evaluate(this.inputCacheId ? undefined : this.input, this.inputCacheId, this.example)
      .subscribe(
      (evaluation) => {
        this.processed = undefined;

        if (evaluation.status === 'OK') {
          if (this.inputCacheId !== evaluation.inputCacheId) {
            this.inputCacheId = evaluation.inputCacheId;
          }

          this.evaluation = evaluation;
          this.inputFormat = evaluation.formatik.inputFormat;
          this.size = evaluation.formatik.inputSize;
          this.records = evaluation.formatik.inputRecords;
          this.trunkated = false;
          this.process();
        } else {
          switch (evaluation.errorCode) {
            case 'InputCacheNotFound':
              this.inputCacheId = undefined;
              this.evaluate();
              break;

            default:
              this.handleError(evaluation.error);
              break;
          }
        }
      },
      (error) => {
        this.handleError(error);
      });
  }

  process(): void {
    this.evaluationInProgress = true;

    if (this.evaluation.formatId) {
      this.formatikService
        .process(this.evaluation.formatId, this.inputCacheId ? undefined : this.input, this.inputCacheId)
        .subscribe((processed) => {

          if (processed.status === 'OK') {
            if (this.inputCacheId !== processed.inputCacheId) {
              this.inputCacheId = processed.inputCacheId;
            }

            this.evaluationInProgress = false;
            this.processed = processed;
            this.size = processed.inputSize;
            this.records = processed.processedRecords;
            this.trunkated = processed.trunkated;

            if (this.processed.processedRecords === 10000) {
              this.toastr.warning('Record limit reached. Only the first 10K records were processed. Please subscribe to unlock unlimited record processing');
            }

            this.angulartics2Mixpanel.eventTrack('process', { success: true });
          } else {
            switch (processed.errorCode) {
              case 'InputCacheNotFound':
                this.inputCacheId = undefined;
                this.process();
                break;

              default:
                this.handleError(processed.error);
                break;
            }
          }
        },
        (error) => {
          this.handleError(error);
        });
    } else {
      this.processed = undefined;
      this.size = undefined;
      this.records = undefined;
      this.trunkated = undefined;
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
    this.uploader.uploadAll();
  }

  uploadSuccess(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): void {
    const _this = ((this as any).parent as WebtoolComponent);

    _this.evaluation = undefined;
    _this.processed = undefined;

    const responseObj = JSON.parse(response);

    if (responseObj.status === 'OK') {
      _this.inputCacheId = responseObj.inputCacheId;
      _this.inputFormat = responseObj.inputFormat;
      _this.size = responseObj.size;
      _this.records = responseObj.records;
      _this.input = responseObj.input;
    } else {
      _this.handleError(responseObj.error);
    }

    _this.resetFileUpload();
  }

  uploadError(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): void {
    const _this = ((this as any).parent as WebtoolComponent);
    item.cancel();
    _this.uploader.cancelAll();
    _this.handleError('Error uploading file: Service responded with error');
    _this.resetFileUpload();
  }

  handleError(error: string) {
    this.processed = undefined;
    this.size = undefined;
    this.records = undefined;
    this.trunkated = undefined;
    this.evaluationInProgress = false;
    this.toastr.error(error);
    this.angulartics2Mixpanel.eventTrack('upload', { success: false, error: error });
  }

  resetFileUpload() {
    this.renderer.setElementProperty(this.el.nativeElement.querySelector('#userFileUpload'), 'value', '');
  }

  getSizeLabel(): string {
    if (this.size) {
      if (this.size > 1048576) {
        return Math.round(this.size / 1048576) + ' MB';
      } else if (this.size > 1024) {
        return Math.round(this.size / 1024) + ' KB';
      } else {
        return this.size + ' B';
      }
    } else {
      return undefined;
    }
  }

  onClickBuy() {
    this.stripeCheckoutHandler.open({
      amount: 100,
      currency: 'USD',
      panelLabel: '3 Day Unlimited',
      description: '3 Day Unlimited Data Size Processing',
      image: 'https://webtool.formatik.io/assets/formatik-logo-stripe.png'
    });
  }

  onClickCancel() {
    // If the window has been opened, this is how you can close it:
    this.stripeCheckoutHandler.close();
  }

  onToken(token: IStripeCheckoutToken) {
    this.paymentService.checkout(token)
      .subscribe(payment => {
        if (payment.status === 'OK') {

        } else {
          switch (payment.errorCode) {
            case 'DuplicatePayment':
              break;

            default:
              break;
          }
        }
      });
  }

  validateToken() {
    this.processing = true;
    this.paymentService.validate(this.email, this.token)
      .subscribe(purchaseToken => {
        this.processing = false;
        if (purchaseToken.status === 'OK') {
          this.email = undefined;
          this.cookie.put(tokenCookie, purchaseToken.token, { expires: moment(purchaseToken.expires).toDate() });
          this.toastr.success('Token successfully validated. Enjoy unrestricted data size Formatiks!');
        } else {
          this.email = undefined;
          this.token = undefined;

          switch (purchaseToken.errorCode) {
            case 'Expired':
            case 'InvalidToken':
              this.cookie.remove(tokenCookie);
              this.toastr.error('Invalid token or token has expired');
              break;

            default:
              this.toastr.error(purchaseToken.error);
          }
        }
      },
      (error) => {
        this.email = undefined;
        this.token = undefined;
        this.processing = false;

        this.handleError(error);
      });
  }
}
