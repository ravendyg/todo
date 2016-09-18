/// <reference path="./../../types.d.ts" />

import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, PopoverController } from 'ionic-angular';

import { UtilsService } from '../../services/utils-service';
import { DataStorageService } from '../../services/data-storage-service';

import { OrderByDueDate, PriorityFilter } from './../../filters/filters';

import { EditTodoModal } from '../edit-todo/edit-todo';
import { PrioritySelector } from '../priority-selector';


@Component({
  pipes: [ OrderByDueDate, PriorityFilter ],
  templateUrl: 'build/pages/todos/todos.html'
})
export class TodosPage implements OnInit
{
  private popover: PopoverController;
  public dataStore: { todos: Todo [] };

  public alert: { color: string };

  public dataLoaded: boolean;
  public nowDate: string;

  public priorityFilterValue: number;

  constructor (
    private _data: DataStorageService,
    private _modalCtrl: ModalController,
    private _utils: UtilsService,
    private _popover: PopoverController
  )
  {
    var self = this;
window['tt'] = self;
    this.dataLoaded = false;

    this.popover = _popover;

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

  }

  public ngOnInit (): void
  {
    this.dataStore = this._data.dataStore;

    this.priorityFilterValue = 0;
  }

  public editTodo ( id?: number): void
  {
    if ( this.dataLoaded )
    {
      var todo =
        id
        ? this.dataStore.todos.find( e => e.id === id )
        : this._data.generateEmptyTodo()
        ;
      var mode = id ? 'edit' : 'add';

      var todoModal = this._modalCtrl.create(
        EditTodoModal, { todo, mode }
      );
      todoModal.present();
    }
  }

  public presentPrioritySelector ( event: any ): void
  {
    var self = this;

    var popover = this.popover.create(
      PrioritySelector,
      {
        cb: newPriority =>
        {
          self.priorityFilterValue = newPriority;
          self.dataStore

        }
      }
    );
    popover.present( { ev: event } );
  }

  public toggleTodo ( id: number ): void
  {
    this._data.toggleTodo( id );
  }

}
