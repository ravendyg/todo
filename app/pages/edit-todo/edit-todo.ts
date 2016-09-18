import { Component } from '@angular/core';
import { Platform, NavParams, ViewController } from 'ionic-angular';

import { DataStorageService } from '../../services/data-storage-service';
import { UtilsService } from '../../services/utils-service';

@Component({
  templateUrl: 'build/pages/edit-todo/edit-todo.html'
})
export class EditTodoModal
{
  public action: string;
  public todo: Todo;

  public minDate: string;
  public maxDate: string;

  private _view: ViewController;
  private _data: DataStorageService;
  // private _utils: UtilsService;

  constructor(
    private platform: Platform,
    private _params: NavParams,
    private view: ViewController,
    private utils: UtilsService,
    private data: DataStorageService
  )
  {
    // this._utils = utils;

    if ( _params.get('mode') === 'add' )
    {
      this.action = 'Add todo';
    }
    else
    {
      this.action = 'Edit todo';
    }

    this.todo = _params.get('todo');
    console.log(this.todo);

    this._view = view;

    // set up date limits
    var now = new Date();
    this.minDate =
      now.getFullYear() + '-' +
      utils.indentMonth( now.getMonth() )+ '-' +
      now.getDate();
    var future = new Date( now.getTime() + 1000 * 60 * 60 * 24 * 365 );
    this.maxDate =
      future.getFullYear() + '-' +
      utils.indentMonth( future.getMonth() ) + '-' +
      future.getDate();

    this._data = data;
  }

  public setPriority (newPriority: number): void
  {
    this.todo.priority = newPriority;
  }

  public save ()
  {
    if ( this.todo.title.length > 0 )
    {
      this._data.save( this.todo );
      this._view.dismiss();
    }
  }

  public debugClose ()
  {
    this._view.dismiss();
  }
}
