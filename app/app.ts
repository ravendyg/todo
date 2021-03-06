/// <reference path="./types.d.ts" />
import { Component, enableProdMode } from '@angular/core';
enableProdMode();
import { Platform, ionicBootstrap } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { TodosPage } from './pages/todos/todos';

import { DataStorageService } from './services/data-storage-service';
import { UtilsService } from './services/utils-service';

import { OrderByDueDate, PriorityFilter, CapFirstLetters, DateFilter } from './filters/filters';


@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class MyApp {

  public rootPage: any;

  constructor(private platform: Platform) {
    this.rootPage = TodosPage;

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }
}

ionicBootstrap(
  MyApp,
  [
    DataStorageService,
    UtilsService,
    OrderByDueDate,
    PriorityFilter,
    CapFirstLetters,
    DateFilter
  ]);
