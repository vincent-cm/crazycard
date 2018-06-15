import { Inject, Injectable, Optional } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { map } from 'rxjs/operators';
import { User } from 'app/card/_models';
import { Observable } from 'rxjs';

@Injectable()
export class CardService {
  constructor(protected http: Http) { }

  public searchCard(user: User): Observable<any> {
    if (user === null || user === undefined) {
      throw new Error(
        'Required parameter user was null or undefined when calling search.'
      );
    }
    const headers = new Headers();

    // to set the Accept header
    headers.set('Accept', 'application/json');

    // to determine the Content-Type header
    const consumes: string[] = [];

    return this.http
      .post('/api/search', JSON.stringify({ ...user }), {
        withCredentials: true,
        headers: headers
      })
      .pipe(map((response: Response) => response.json()));
  }
}

export interface Result {
  result?: any;
  message?: string;
  error?: number;
}
