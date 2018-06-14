/**
 *
 * filter an Object by removing some properties configured by patterns:
 *
 * filterBase: removing id, dateCreated, dateUpdated, uid
 *
 * hideNull: removing properties with null value
 *
 * filterObject: removing properties refer to other Objects
 *
 * sortProiorites: sort the keys accroding to input priority list
 *
 *
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'myKeysFiltered' })
export class KeysPipe implements PipeTransform {
  transform(value, filterBase?, hideNull?, filterObject?, sortProiories?): any {
    if (!value) {
      return null;
    }

    let Iterator = Object.keys(value);

    if (sortProiories) {
      Iterator.sort(
        (a, b) =>
          (sortProiories.indexOf(a.toUpperCase()) >= 0
            ? sortProiories.indexOf(a.toUpperCase())
            : Number.MAX_SAFE_INTEGER) -
          (sortProiories.indexOf(b.toUpperCase()) >= 0
            ? sortProiories.indexOf(b.toUpperCase())
            : Number.MAX_SAFE_INTEGER)
      );
    }

    if (filterBase) {
      Iterator = Iterator.filter(item => {
        return (
          item !== 'id' && item !== 'dateCreated' && item !== 'lastUpdated'
        );
      });
    }

    if (hideNull) {
      Iterator = Iterator.filter(item => {
        return item && value[item];
      });
    }

    if (filterObject) {
      Iterator = Iterator.filter(item => {
        return (
          item &&
          (typeof value[item] !== 'object' ||
            Object.prototype.toString.call(value[item]) === '[object Date]' ||
            value[item] == null)
        );
      });
    }

    return Iterator;
  }
}
