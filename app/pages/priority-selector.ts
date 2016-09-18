/// <reference path="./../types.d.ts" />

import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';


@Component({
  template: `
    <ion-list style="margin: 0;">
      <button ion-item (click)="select(0)">All</button>
      <button ion-item (click)="select(1)">Normal</button>
      <button ion-item (click)="select(2)">High</button>
      <button ion-item (click)="select(3)">Important</button>
    </ion-list>
  `
})
export class PrioritySelector
{
  private cb: Function;

  constructor (
    private viewCtrl: ViewController,
    private _navParams: NavParams
  )
  {
    this.cb = _navParams.get('cb');
  }

  select ( val: number): void
  {
    this.cb( val );
    this.close();
  }

  close (): void
	{
    this.viewCtrl.dismiss();
  }
}