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

}