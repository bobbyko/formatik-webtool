import { Component } from "@angular/core";
import { Clipboard } from "ts-clipboard";

import { InstaFormatikService } from "../services/insta-formatik-service";

type InstaFormatik = {
  instaformatikMessage: string;
  _id?: string;
};

@Component({
  selector: "insta-formatik-cmp",
  templateUrl: "insta-formatik/templates/insta-formatik.html",
  styleUrls: [location.hash === "#embedded" ? "insta-formatik/styles/embedded.css" : "insta-formatik/styles/insta-formatik.css"]
})

export class InstaFormatikCmp {
  public input: string;
  public example: string;

  public inputCacheId: string;
  public evaluationInProgress: boolean;
  public evaluation: any;
  public processed: any;
  public error: any;
  public warning: string;

  constructor(private _instaFormatikService: InstaFormatikService) {
    this.evaluationInProgress = false;
  }

  canEvaluate(): Boolean {
    return !this.evaluationInProgress &&
      this.input && this.input != '' &&
      this.example && this.example != '';
  }

  inputChanged(): void {
    this.inputCacheId = null;
    this.evaluation = null;
    this.processed = null;
    this.error = null;
    this.warning = null;
  }

  exampleChanged(): void {
    this.evaluation = null;
    this.processed = null;
    this.error = null;
    this.warning = null;
  }

  evaluate(): void {
    this.evaluationInProgress = true;
    this.error = null;

    this._instaFormatikService
      .evaluate(this.inputCacheId ? null : this.input, this.inputCacheId, this.example)
      .subscribe(
      (evaluation) => {
        this.processed = null;

        if (evaluation.status === 'OK') {
          if (this.inputCacheId != evaluation.inputCacheId)
            this.inputCacheId = evaluation.inputCacheId;

          this.evaluation = evaluation;
          this.process();
        }
        else {
          switch (evaluation.errorCode) {
            case "InputCacheNotFound":
              this.inputCacheId = null;
              this.evaluate();
              break;

            default:
              this.evaluation = null;
              this.warning = evaluation.error;
              this.evaluationInProgress = false;
              break;
          }
        }
      },
      (error) => {
        this.evaluation = null;
        this.evaluationInProgress = false;
        this.error = error;
      });
  }

  process(): void {
    this.evaluationInProgress = true;
    this.error = null;
    this.warning = null;

    if (this.evaluation.formatId) {
      this._instaFormatikService
        .process(this.evaluation.formatId, this.inputCacheId ? null : this.input, this.inputCacheId)
        .subscribe((processed) => {

          if (processed.status === 'OK') {
            if (this.inputCacheId != processed.inputCacheId)
              this.inputCacheId = processed.inputCacheId;

            this.evaluationInProgress = false;
            this.processed = processed;
          }
          else {
            switch (processed.errorCode) {
              case "InputCacheNotFound":
                this.inputCacheId = null;
                this.process();
                break;

              default:
                this.processed = null;
                this.evaluationInProgress = false;
                this.warning = processed.error;
                break;
            }
          }
        },
        (error) => {
          this.processed = null;
          this.evaluationInProgress = false;
          this.error = error;
        });
    }
    else {
      this.processed = null;
    }
  }

  getProcessed(): string {
    return this.processed && this.processed.status === 'OK' ? this.processed.result : null;
  }
}
