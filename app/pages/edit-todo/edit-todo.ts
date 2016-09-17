import { Component } from '@angular/core';
import { Platform, NavParams, ViewController } from 'ionic-angular';

@Component({
  templateUrl: 'build/pages/edit-todo/edit-todo.html'
})
export class EditTodoModal
{
  public action: string;
  public todo: Todo;

  private _view: ViewController;

  constructor(
    private platform: Platform,
    private _params: NavParams,
    private view: ViewController
  )
  {
    if ( _params.get('mode') === 'add' )
    {
      this.action = 'Create todo';
    }
    else
    {
      this.action = 'Edit todo';
    }

    this.todo = _params.get('todo');
    this._view = view;
  }

  private _registerBackButtonMenuHandler()
  {

    // register back button handler when menu has been opened
    var unregisterBackButton = this.platform.registerBackButtonAction(
      () => {
        unregisterBackButton();
        this._view.dismiss();
      },
      10
    );

  }
}
