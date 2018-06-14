import { Injectable } from '@angular/core';
import '../../../node_modules/ngx-toastr/toastr.css';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class Notice {
  constructor(private toastr: ToastrService) { }

  public success(msg, title?) {
    this.showInfo(title ? title : 'Operation success', msg);
  }

  public info(msg, title?) {
    this.showInfo(title ? title : 'Info', msg);
  }

  public warn(msg, title?) {
    this.showWarning(title ? title : 'Warning', msg);
  }

  public error(msg, title?) {
    this.showWarning(title ? title : 'Error', msg);
  }

  // public error(msg, title?) {
  //   swal({
  //     title: title ? title : 'Oops, error happened',
  //     text: msg,
  //     type: 'error',
  //     showCancelButton: false,
  //     confirmButtonColor: '#DD6B55',
  //     confirmButtonText: 'Dismiss',
  //     closeOnConfirm: true
  //   });
  // }

  // public warn(msg, title?) {
  //   swal({
  //     title: title ? title : 'Operation may not success',
  //     text: msg,
  //     type: 'warning',
  //     showCancelButton: false,
  //     confirmButtonColor: '#DD6B55',
  //     confirmButtonText: 'Got it!',
  //     closeOnConfirm: true
  //   });
  // }

  public showInfo(title: string, msg: string) {
    this.toastr.success(msg, title, {
      closeButton: true,
      disableTimeOut: false,
      easing: 'ease-in-out',
      easeTime: '100',
      enableHtml: true,
      toastClass: 'toast',
      positionClass: 'toast-bottom-full-width',
      titleClass: 'toast-title',
      messageClass: 'toast-message',
      tapToDismiss: true
    });
  }

  public showWarning(title: string, msg: string) {
    this.toastr.warning(msg, title, {
      closeButton: true,
      disableTimeOut: true,
      easing: 'ease-in-out',
      easeTime: '100',
      enableHtml: true,
      toastClass: 'toast',
      positionClass: 'toast-bottom-full-width',
      titleClass: 'toast-title',
      messageClass: 'toast-message',
      tapToDismiss: false
    });
  }
}
