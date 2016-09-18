/// <reference path="./../types.d.ts" />

import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
	name: 'orderByDueDate'
})
export /**
 * OrderByDueDate
 */
class OrderByDueDate implements PipeTransform
{
	constructor ()
	{
	}

	public transform (array: Todo []): Todo []
  {
    var out =
			array.sort(
				(e1: Todo, e2: Todo) =>
				{
					if ( e1.targetDate > e2.targetDate ) { return 1; }
					if ( e1.targetDate < e2.targetDate ) { return -1; }
					return 0;
				}
			);
		return out;
  }
}

@Pipe({
	name: 'priorityFilter'
})
export /**
 * PriorityFilter
 */
class PriorityFilter implements PipeTransform
{
	constructor ()
	{
	}

	public transform (array: Todo [], priorityVal: number): Todo []
  {
    var out =
			array
			.filter(
				(e: Todo) => priorityVal === 0 || e.priority === priorityVal ? true : false
			);
		return out;
  }
}