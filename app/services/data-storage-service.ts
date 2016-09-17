/// <reference path="./../types.d.ts" />

import { Injectable, OnInit } from '@angular/core';
import { Importance } from '../consts/enums';

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

	public dataStore:
	{
		todos: Todo []
	};

	constructor ()
	{
		this._id = 0;

		this.dataStore =
		{
			todos: [
				{
					id: ++this._id,
					title: 'todo1',
					description: 'sdfsd',
					priority: Importance.AVERAGE_PRIORITY,
					doneDate: 0,
					targetDate: Date.now() + 1000 * 60 * 2
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
		var newTodo =
		{
			id: ++this._id,
			title: '',
			description: '',
			priority: Importance.LOW_PRIORITY,
			doneDate: 0,
			targetDate: 0
		}

		return newTodo;
	}


}