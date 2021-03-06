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
          .then(
            () =>
            {
              resolve(true);
            }
          )
          .catch( () => resolve(false) );
        }
      );

    this._id = 0;
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
      newTodo.id = ++this._id;
		  this.dataStore.todos = this.dataStore.todos.concat([ newTodo ]);
    }
		this._saveToDb( newTodo );
	}

	public subscribeForDataLoadedEvent (): Promise<boolean>
	{
		return this._dataLoaded;
	}

  public toggleTodo ( id: number ): void
  {
    var targetTodo = this.dataStore.todos.find( e => e.id === id );
    if ( targetTodo.doneDate )
    {
      targetTodo.doneDate = '';
    }
    else
    {
      targetTodo.doneDate = this.utils.getDate();
    }
    this.save( targetTodo, 'edit' );
  }

  public deleteTodo ( id: number ): void
  {
    var i;
    for ( i = 0; i < this.dataStore.todos.length; i++ )
    {
      if ( this.dataStore.todos[i].id === id )
      {
        break;
      }
    }
    this.dataStore.todos =
      this.dataStore.todos.slice(0, i)
      .concat( this.dataStore.todos.slice(i+1) )
      ;

    this._deleteFromDb( id );
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
          var cursorRequest = store.openCursor();
          // var request = store.getAll();  // doesn't work for 4.4
          cursorRequest.addEventListener(
            'success',
            event =>
            {
              var cursor = cursorRequest.result;
              if ( cursor )
              {
                self.dataStore.todos.push( cursor.value );
                self._id = cursor.value.id > self._id ? cursor.value.id : self._id;
                // console.log(cursor);
                cursor.continue();
              }
              else
              { // exhausted
                self.dataStore.todos = self.dataStore.todos.slice();  // force update
                resolve(true);
              }
              // self.dataStore.todos = request.result;
              // get last id

                // self.dataStore.todos
                // .reduce( (acc, e) => acc < e.id ? e.id : acc, 0 );
// self.dataStore.todos = self.dataStore.todos.concat([{
//   id: ++self._id,
//   title: 'todo1',
//   description: 'sdfsd',
//   priority: Importance.AVERAGE_PRIORITY,
//   doneDate: '',
//   targetDate: '2016-09-15T00:00:00Z'
// }]);

            }
          );
          cursorRequest.addEventListener(
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
            self.dataStore.todos = JSON.parse( strData ) || [];
            self._id =
              self.dataStore.todos
              .reduce( (acc, e) => acc < e.id ? e.id : acc, 0 );
// self.dataStore.todos = self.dataStore.todos.concat([{
//   id: ++self._id,
//   title: 'todo1',
//   description: 'sdfsd',
//   priority: Importance.AVERAGE_PRIORITY,
//   doneDate: '',
//   targetDate: '2016-09-15T00:00:00Z'
// }]);
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

  private _deleteFromDb ( id: number ): void
	{
		if ( indexedDB )
		{
			var transaction = _db.transaction( _todosStoreName, 'readwrite');
			var store = transaction.objectStore( _todosStoreName );
			var request = store.delete( id );
		}
		else
		{
			var strTodos = JSON.stringify( this.dataStore.todos );
			localStorage.setItem('todos-app-data', strTodos);
		}
	}


}