import { DOCUMENT } from "@angular/platform-browser";
import { Inject } from "@angular/core";
import { Injectable } from "@angular/core";

@Injectable()
export class AppReadyEvent {
  private doc: Document;
  private isAppReady: boolean;

  constructor(@Inject(DOCUMENT) doc: any) {
    this.doc = doc;
    this.isAppReady = false;
  }

  public trigger(): void {
    if (this.isAppReady) {
      return;
    }

    const bubbles = true;
    const cancelable = false;

    this.doc.dispatchEvent(this.createEvent("appready", bubbles, cancelable));
    this.isAppReady = true;
  }

  public triggerLoad(): void {
    if (!this.isAppReady) {
      return;
    }

    const bubbles = true;
    const cancelable = false;

    this.doc.dispatchEvent(this.createEvent("apploading", bubbles, cancelable));
    this.isAppReady = false;
  }

  private createEvent(
    eventType: string,
    bubbles: boolean,
    cancelable: boolean
  ): Event {
    let customEvent: any;
    try {
      customEvent = new CustomEvent(eventType, {
        bubbles: bubbles,
        cancelable: cancelable
      });
    } catch (error) {
      customEvent = this.doc.createEvent("CustomEvent");
      customEvent.initCustomEvent(eventType, bubbles, cancelable);
    }

    return customEvent;
  }
}
