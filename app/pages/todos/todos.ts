/// <reference path="./../../types.d.ts" />

import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from 'ionic-angular';

import { DataStorageService } from '../../services/data-storage-service';

import { EditTodoModal } from '../edit-todo/edit-todo';
// import { HomePage } from '../home/home';
// import { AboutPage } from '../about/about';
// import { ContactPage } from '../contact/contact';

@Component({
  templateUrl: 'build/pages/todos/todos.html'
})
export class TodosPage implements OnInit
{
  public dataStore: { todos: Todo [] };

  // public tab1Root: any;
  // public tab2Root: any;
  // public tab3Root: any;

  constructor (
    private _data: DataStorageService,
    private _modalCtrl: ModalController
  )
  {
    // // this tells the tabs component which Pages
    // // should be each tab's root Page
    // this.tab1Root = HomePage;
    // this.tab2Root = AboutPage;
    // this.tab3Root = ContactPage;

  }

  public ngOnInit (): void
  {
    this.dataStore = this._data.dataStore;
  }

  public addTodo (): void
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
