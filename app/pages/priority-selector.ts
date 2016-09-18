/// <reference path="./../types.d.ts" />

import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';


@Component({
  template: `
    <ion-list style="margin: 0;">
      <button ion-item (click)="select(0)"
        [style.color]="currentPriority === 0 ? 'green' : ''"
      >All</button>
      <button ion-item (click)="select(1)"
        [style.color]="currentPriority === 1 ? 'green' : ''"
      >Normal</button>
      <button ion-item (click)="select(2)"
        [style.color]="currentPriority === 2 ? 'green' : ''"
      >High</button>
      <button ion-item (click)="select(3)"
        [style.color]="currentPriority === 3 ? 'green' : ''"
      >Important</button>
    </ion-list>
  `
})
export class PrioritySelector
{
  private cb: Function;
  public currentPriority: number;

  constructor (
    private viewCtrl: ViewController,
    private _navParams: NavParams
  )
  {
    this.cb = _navParams.get('cb');
    this.currentPriority = _navParams.get('priority');
  }

  select ( val: number): void
  {
    this.currentPriority = val;
    this.cb( val );
    this.close();
  }

  close (): void
	{
    this.viewCtrl.dismiss();
  }
}