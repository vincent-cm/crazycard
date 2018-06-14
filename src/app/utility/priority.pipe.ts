import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'myAttrPriorityPipe' })
export class AttrPriorityPipe implements PipeTransform {
  transform(list, sortProiories?): any {
    if (!list) {
      return null;
    }

    const ordered = {};

    if (sortProiories) {
      list.sort(
        (a, b) =>
          (a.name && sortProiories.indexOf(a.name.toUpperCase()) >= 0
            ? sortProiories.indexOf(a.name.toUpperCase())
            : Number.MAX_SAFE_INTEGER) -
          (b.name && sortProiories.indexOf(b.name.toUpperCase()) >= 0
            ? sortProiories.indexOf(b.name.toUpperCase())
            : Number.MAX_SAFE_INTEGER)
      );
    }

    return list;
  }
}
