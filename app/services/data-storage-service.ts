/// <reference path="./../types.d.ts" />
'use strict';

import { Injectable, OnInit } from '@angular/core';
import { Importance } from '../consts/enums';

import { UtilsService } from './utils-service';

var _db: IDBDatabase = null;
var _dbName = 'todos';
var _todosStoreName = 'todos';

@Injectable()
export /**
 * DataStorageService
 */
class DataStorageService implements OnInit
{
	private _id: number;

	private _utils: UtilsService;

	private _dataLoaded: Promise<boolean>;

	public dataStore:
	{
		todos: Todo []
	};

	constructor (
		private utils: UtilsService
	)
	{
    var self = this;

		this._utils = utils;

		var now = new Date();
    var tDate =
      now.getFullYear() + '-' +
      utils.indentMonth( now.getMonth() )+ '-' +
      now.getDate();

		this.dataStore =
		{
			todos: []
		};

    this._dataLoaded =
      new Promise(
        resolve =>
        {
          self._initDb()
          .then(  () => self._readFromDb() )
          .then(  () => resolve(true) )
          .catch( () => resolve(false) );
        }
      );
	}

	public ngOnInit (): void
	{
	}

	public generateEmptyTodo (): Todo
	{
		var newTodo =
		{
			id: ++this._id,
			title: '',
			description: '',
			priority: Importance.LOW_PRIORITY,
			doneDate: '',
			targetDate: ''
		}

		return newTodo;
	}

	public save ( newTodo: Todo, mode: string ): void
	{
    if ( mode === 'edit' )
    {
      for ( var i = 0; i < this.dataStore.todos.length; i++ )
      {
        if ( this.dataStore.todos[i].id === newTodo.id )
        {
          break;
        }
      }
      this.dataStore.todos =
        this.dataStore.todos
        .slice(0, i)
        .concat([ newTodo ])
        .concat( this.dataStore.todos.slice( i+1 ))
        ;
    }
    else
    {
		  this.dataStore.todos = this.dataStore.todos.concat([ newTodo ]);
    }
		this._saveToDb( newTodo );
	}

	public subscribeForDataLoadedEvent (): Promise<boolean>
	{
		return this._dataLoaded;
	}

  private _initDb (): Promise<boolean>
  {
    return new Promise(
      (resolve, reject) =>
      {
        if ( indexedDB )	// hi Apple
        {
          var request = indexedDB.open(_dbName, 1);

          request.addEventListener(
            'upgradeneeded',
            ev =>
            {
              _db = (<IDBOpenDBRequest>ev.target).result;

              while ( _db.objectStoreNames.length > 0 )
              {
                _db.deleteObjectStore( _db.objectStoreNames[0] );
              }

              _db.createObjectStore( _todosStoreName );
            }
          );

          request.addEventListener(
            'success',
            ev =>
            {
              _db = (<IDBOpenDBRequest>ev.target).result;
              resolve(true);
            }
          );

          request.addEventListener(
            'error',
            err =>
            {
              reject(err);
            }
          );
        }
        else
        {
          resolve(true);
        }
      }
    );
  }

	private _readFromDb (): Promise<boolean>
	{
    var self = this;

		return new Promise(
			resolve =>
			{
        if ( indexedDB )
        {
				  var transaction = _db.transaction( _todosStoreName, 'readwrite');
          var store = transaction.objectStore( _todosStoreName );
          var request = store['getAll']();  // smth is wrong with typings
          request.addEventListener(
            'success',
            () =>
            {
              self.dataStore.todos = request.result;
              // get last id
              self._id =
                self.dataStore.todos
                .reduce( (acc, e) => acc < e.id ? e.id : acc, 0 );
self.dataStore.todos = self.dataStore.todos.concat([{
  id: ++self._id,
  title: 'todo1',
  description: 'sdfsd',
  priority: Importance.AVERAGE_PRIORITY,
  doneDate: '',
  targetDate: '2016-09-15'
}]);
              resolve(true);
            }
          );
          request.addEventListener(
            'error',
            () =>
            {
              resolve(false);
            }
          );
        }
        else
        {
          try
          {
            var strData = localStorage.getItem('todos-app-data');
            self.dataStore.todos = JSON.parse( strData );
            resolve(true);
          }
          catch (e)
          {
            resolve(false);
          }
        }
			}
		);
	}

	private _saveToDb ( newTodo: Todo ): void
	{
		if ( indexedDB )
		{
			var transaction = _db.transaction( _todosStoreName, 'readwrite');
			var store = transaction.objectStore( _todosStoreName );
			var request = store.put( newTodo, newTodo.id );
		}
		else
		{
			var strTodos = JSON.stringify( this.dataStore.todos );
			localStorage.setItem('todos-app-data', strTodos);
		}
	}


}