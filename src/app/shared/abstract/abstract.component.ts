import { OnInit } from '@angular/core';
import { AbstractClass } from './abstract-class';

export abstract class AbstractComponent extends AbstractClass implements OnInit {
  public ngOnInit() {
    // onOnInit
  }
}
