/// <reference path="./../types.d.ts" />

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

	public dataStore:
	{
		todos: Todo []
	};

	constructor (
		private utils: UtilsService
	)
	{
		this._id = 0;

		this._utils = utils;

		var now = new Date();
    var tDate =
      now.getFullYear() + '-' +
      utils.indentMonth( now.getMonth() )+ '-' +
      now.getDate();

		this.dataStore =
		{
			todos: [
				{
					id: ++this._id,
					title: 'todo1',
					description: 'sdfsd',
					priority: Importance.AVERAGE_PRIORITY,
					doneDate: '',
					targetDate: tDate
				}
			]
		};
	}

	public ngOnInit (): void
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
			}
		);
	}

	public generateEmptyTodo (): Todo
	{
		var now = new Date();
    var tDate =
      now.getFullYear() + '-' +
      this._utils.indentMonth( now.getMonth() )+ '-' +
      now.getDate();

		var newTodo =
		{
			id: ++this._id,
			title: '',
			description: '',
			priority: Importance.LOW_PRIORITY,
			doneDate: '',
			targetDate: tDate
		}

		return newTodo;
	}

	public save ( newTodo: Todo ): void
	{
		this.dataStore.todos.push( newTodo );
	}


}