import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, of, empty } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import '../../../node_modules/ngx-toastr/toastr.css';
import { ToastrService } from 'ngx-toastr';
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private toastr: ToastrService) { }
  public showError(codeOrMsg: string) {
    codeOrMsg
      ? (codeOrMsg = ': ' + codeOrMsg.slice(0, 19) + '... ')
      : (codeOrMsg = '');
    this.toastr.warning(
      'Server unavailable' + codeOrMsg,
      'Sorry, please save your data and retry. Your request may not be sent.',
      {
        closeButton: true,
        disableTimeOut: true,
        easing: 'ease-in-out',
        easeTime: '100',
        enableHtml: true,
        toastClass: 'toast',
        positionClass: 'toast-top-full-width',
        titleClass: 'toast-title',
        messageClass: 'toast-message',
        tapToDismiss: true
      }
    );
  }
  public intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          // A client-side or network error occurred. Handle it accordingly.
          this.showError(err.error.message);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          this.showError(err.status.toString() + ' ' + err.error);
        }
        return empty();
      })
    );
  }
}
