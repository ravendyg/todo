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

@Pipe({
	name: 'capFirstLetters'
})
export /**
 * CapFirstLetters
 */
class CapFirstLetters implements PipeTransform
{
	constructor ()
	{
	}

	public transform (input: string): string
  {
    var out =
			input
			.split(' ')
			.map( e => e.charAt(0).toUpperCase() + e.slice(1) )
			.join(' ')
			;

		return out;
  }
}

@Pipe({
	name: 'dateFilter'
})
export /**
 * DateFilter
 */
class DateFilter implements PipeTransform
{
	constructor ()
	{
	}

	public transform ( date: string ): string
  {
    var out =
			date
			.replace('T', ' - ')
			.replace(/\:[0-9]{2}Z$/, '')
			;

		return out;
  }
}