import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// logger
import { Log } from 'ng2-logger';
import Type = SharedData.Type;

const log = Log.create('data.service');
log.color = '#a2111d';

/**
 * This service is global data exchange between the component.
 *
 * Update 2018 March 19:
 *   add data type with the data object.
 */

export interface SharedData {
  data?: any;
  type?: Type;
}

export namespace SharedData {
  export type Type = 'USER' | 'CARD';
  export const Type = {
    USER: 'USER' as Type,
    DOMAIN: 'DOMAIN' as Type
  };
}

@Injectable()
export class DataService {
  private _messageSource = new BehaviorSubject<SharedData>({});
  private _currentMessage = this._messageSource.asObservable();

  get currentMessage(): Observable<SharedData> {
    return this._currentMessage;
  }

  set currentMessage(value: Observable<SharedData>) {
    this._currentMessage = value;
  }

  get messageSource(): BehaviorSubject<SharedData> {
    return this._messageSource;
  }

  set messageSource(value: BehaviorSubject<SharedData>) {
    this._messageSource = value;
  }

  constructor() {
    // log.info('constructor', 'constructor');
  }

  public changeMessage(message: SharedData) {
    // log.info('changeMessage', message);
    this._messageSource = new BehaviorSubject<SharedData>({});
    this._currentMessage = this._messageSource.asObservable();
    this._messageSource.next(message);
    // this.messageSource.complete();
  }
}
