import {
  BaseRequestOptions,
  Http,
  RequestMethod,
  RequestOptions,
  Response,
  ResponseOptions,
  XHRBackend
} from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Card } from '../../card/_models/card';
import { User, User_Enum } from '../../card/_models/user';
import { Util } from 'app/utility/tools';
import { KeysPipe } from '../../utility/keys.pipe';

// Cards
// Student Life Card: The Student Life credit card is only available to customers with an employment status of Student.
// Apr – 18.9%
// Balance Transfer Offer Duration – 0 months
// Purchase Offer Duration – 6 Months
// Credit Available - £1200

// Anywhere Card – The anywhere card is available to anyone anywhere.
// Apr – 33.9%
// Balance Transfer Offer Duration – 0 months
// Purchase Offer Duration – 0 Months
// Credit Available - £300

// Liquid Card – The Liquid card is a card available to customers who have an income of more than £16000.
// Apr – 33.9%
// Balance Transfer Offer Duration – 12 months
// Purchase Offer Duration – 6 Months
// Credit Available - £3000
export function mockBackEndFactory(
  backend: MockBackend,
  options: BaseRequestOptions,
  realBackend: XHRBackend
) {
  // id?: number;
  // name?: string;
  // description?: string;
  // apr?: string;
  // balancetransferofferduation?: number;
  // purchaseofferduration?: number;
  // credit?: number;
  const cardConfig = [
    {
      name: 'Student Life Card',
      apr: '18.9%',
      balancetransferofferduation: 0,
      purchaseofferduration: 6,
      credit: 1200
    },
    {
      name: 'Anywhere Card',
      apr: '33.9%',
      balancetransferofferduation: 0,
      purchaseofferduration: 0,
      credit: 300
    },
    {
      name: 'Liquid Card',
      apr: '33.9%',
      balancetransferofferduation: 12,
      purchaseofferduration: 6,
      credit: 3000
    }
  ];
  const stdCard = Object.create(Card);

  for (let key in cardConfig[0]) {
    if (cardConfig[0].hasOwnProperty(key)) {
      if (key === 'name') {
        Object.defineProperty(stdCard, 'name', {
          writable: true
        });
      }
      stdCard[key] = cardConfig[0][key];
    }
  }

  const anyCard = Object.create(Card);
  for (let key in cardConfig[1]) {
    if (cardConfig[1].hasOwnProperty(key)) {
      if (key === 'name') {
        Object.defineProperty(anyCard, 'name', {
          writable: true
        });
      }
      anyCard[key] = cardConfig[1][key];
    }
  }

  const liqCard = Object.create(Card);
  for (let key in cardConfig[2]) {
    if (cardConfig[2].hasOwnProperty(key)) {
      if (key === 'name') {
        Object.defineProperty(liqCard, 'name', {
          writable: true
        });
      }
      liqCard[key] = cardConfig[2][key];
    }
  }

  // configure fake backend
  backend.connections.subscribe((connection: MockConnection) => {
    // wrap in timeout to simulate server api call
    setTimeout(() => {
      if (
        connection.request.url.endsWith('/api/search') &&
        connection.request.method === RequestMethod.Post
      ) {
        // get parameters from post request
        const user = JSON.parse(connection.request.getBody());

        // title?,
        // firstname?,
        // lastname?,
        // dob?,
        // income?,
        // employment?,
        // housenumber?,
        // postcode?
        if (user) {
          let errorMsg = '';

          const userAttributes = new KeysPipe().transform(
            new User(),
            true,
            false,
            true
          );

          userAttributes.forEach(el => {
            if (user[el] === null || user[el] === undefined) {
              errorMsg += Util.capitalizeFirstLetter(el) + ' is invalid.\n';
            }
          });

          if (user.dob && !Util.isValidDate(user.dob)) {
            errorMsg += 'Date of Birth' + ' is invalid.\n';
          }

          if (user.income && +user.income < 0) {
            errorMsg += 'Income' + ' is invalid.\n';
          }

          if (user.housenumber && +user.housenumber < 0) {
            errorMsg += 'House Number' + ' is invalid.\n';
          }

          const pattern = /^[A-Z]{1,2}[0-9]{1,2}[A-Z]{0,1} ?[0-9][A-Z]{2}$/i;
          if (user.postcode && !pattern.test(user.postcode)) {
            errorMsg += 'Postcode' + ' is invalid.\n';
          }

          if (errorMsg) {
            connection.mockRespond(
              new Response(
                new ResponseOptions({
                  status: 200,
                  body: {
                    result: {},
                    message: errorMsg,
                    error: 1299
                  }
                })
              )
            );
            return;
          }

          let totalSize: number = 0;
          let resultSize: number = 0;
          let totalCredit: number = 0;
          let nextPage = false;
          const resultCardList = [];

          if (
            user.employment === User_Enum.EmploymentStatusEnum.NA ||
            user.employment === User_Enum.EmploymentStatusEnum.STU ||
            user.employment === User_Enum.EmploymentStatusEnum.PART ||
            user.employment === User_Enum.EmploymentStatusEnum.FULL
          ) {
            totalSize += totalSize;
            resultSize += resultSize;
            resultCardList.push(anyCard);
            totalCredit += +anyCard.credit;
          }

          if (user.employment === User_Enum.EmploymentStatusEnum.STU) {
            totalSize += totalSize;
            resultSize += resultSize;
            resultCardList.push(stdCard);
            totalCredit += +stdCard.credit;
          }

          if (
            (user.employment === User_Enum.EmploymentStatusEnum.PART ||
              user.employment === User_Enum.EmploymentStatusEnum.FULL) &&
            user.income > 16000
          ) {
            totalSize += totalSize;
            resultSize += resultSize;
            resultCardList.push(liqCard);
            totalCredit += +liqCard.credit;
          }

          connection.mockRespond(
            new Response(
              new ResponseOptions({
                status: 200,
                body: {
                  result: {
                    totalSize: totalSize,
                    resultSize: resultSize,
                    nextPage: nextPage,
                    totalCredit: totalCredit,
                    list: resultCardList
                  },
                  message: 'OK_GB',
                  error: 0
                }
              })
            )
          );
        } else {
          // else return 400 bad request
          connection.mockError(new Error('User info is incorrect.'));
        }

        return;
      }

      // pass through any requests not handled above
      const realHttp = new Http(realBackend, options);
      const requestOptions = new RequestOptions({
        method: connection.request.method,
        headers: connection.request.headers,
        body: connection.request.getBody(),
        url: connection.request.url,
        withCredentials: connection.request.withCredentials,
        responseType: connection.request.responseType
      });
      realHttp.request(connection.request.url, requestOptions).subscribe(
        (response: Response) => {
          connection.mockRespond(response);
        },
        (error: any) => {
          connection.mockError(error);
        }
      );
    }, 500);
  });

  return new Http(backend, options);
}

export let fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: Http,
  deps: [MockBackend, BaseRequestOptions, XHRBackend],
  useFactory: mockBackEndFactory
};
