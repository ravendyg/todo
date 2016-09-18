/// <reference path="./../types.d.ts" />

import { Injectable } from '@angular/core';
import { Importance } from '../consts/enums';

@Injectable()
export /**
 * UtilsService
 */
class UtilsService
{
	constructor ()
	{
	}

	public indentMonth (month: number): string
  {
    var tempMonth = '' + (month + 1);
    return tempMonth.length === 1 ? '0' + tempMonth : tempMonth;
  }

	public getDate (): string
	{
		var now = new Date();
    var tDate =
      now.getFullYear() + '-' +
      this.indentMonth( now.getMonth() ) + '-' +
      now.getDate();

		return tDate;
	}

}