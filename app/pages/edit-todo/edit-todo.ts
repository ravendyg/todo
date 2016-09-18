import { Component } from '@angular/core';
import { Platform, NavParams, ViewController } from 'ionic-angular';

import { DataStorageService } from '../../services/data-storage-service';
import { UtilsService } from '../../services/utils-service';

import { CapFirstLetters } from './../../filters/filters';

@Component({
  pipes: [ CapFirstLetters ],
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
    this.action = _params.get('mode');
    this.todo = _params.get('todo');

    this._view = view;

    // set up date limits
    var now = new Date();
    this.minDate =
      now.getFullYear() + '-' +
      utils.indentMonth( now.getMonth() )+ '-' +
      now.getDate() +
      'T00:00:00Z';
    var future = new Date( now.getTime() + 1000 * 60 * 60 * 24 * 365 );
    this.maxDate =
      future.getFullYear() + '-' +
      utils.indentMonth( future.getMonth() ) + '-' +
      future.getDate() +
      'T23:59:00Z';

    this._data = data;
  }

  public setPriority (newPriority: number): void
  {
    this.todo.priority = newPriority;
  }

  public save (): void
  {
    if ( this.todo.title.length > 0 )
    {
      this._data.save( this.todo, this.action );
      this._view.dismiss();
    }
  }

  public debugClose ()
  {
    this._view.dismiss();
  }
}
