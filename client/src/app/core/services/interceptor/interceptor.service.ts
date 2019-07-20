import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { retry, catchError } from 'rxjs/operators';
@Injectable()
export class InterceptorService implements HttpInterceptor {
  constructor(
    
    ) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    request = request.clone();
    return next.handle(request).pipe(retry(3), catchError(err => {
      console.log(err)
      return err
    }));
  }
}