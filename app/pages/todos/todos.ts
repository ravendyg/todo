/// <reference path="./../../types.d.ts" />

import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from 'ionic-angular';

import { UtilsService } from '../../services/utils-service';
import { DataStorageService } from '../../services/data-storage-service';

import { OrderByDueDate } from './../../filters/filters';

import { EditTodoModal } from '../edit-todo/edit-todo';
// import { HomePage } from '../home/home';
// import { AboutPage } from '../about/about';
// import { ContactPage } from '../contact/contact';

@Component({
  pipes: [ OrderByDueDate ],
  templateUrl: 'build/pages/todos/todos.html'
})
export class TodosPage implements OnInit
{
  public dataStore: { todos: Todo [] };

  public alert: { color: string };

  public dataLoaded: boolean;
  public nowDate: string;

  // public tab1Root: any;
  // public tab2Root: any;
  // public tab3Root: any;

  constructor (
    private _data: DataStorageService,
    private _modalCtrl: ModalController,
    private _utils: UtilsService
  )
  {
    var self = this;
window['tt'] = self;
    this.dataLoaded = false;

    _data.subscribeForDataLoadedEvent()
    .then(
      () =>
      {
        self.dataLoaded = true;
      }
    );

    var now = new Date();
    this.nowDate =
      now.getFullYear() + '-' +
      _utils.indentMonth( now.getMonth() )+ '-' +
      now.getDate();

    this.alert = { color: 'red' };
  }

  public ngOnInit (): void
  {
    this.dataStore = this._data.dataStore;
  }

  public addTodo (): void
  {
    if ( this.dataLoaded )
    {
      console.log('adding');
      var todoModal = this._modalCtrl.create(
        EditTodoModal,
        {
          todo: this._data.generateEmptyTodo(),
          mode: 'add'
        }
      );
      todoModal.present();
    }
  }

}
