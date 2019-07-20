import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from "@angular/common/http";

import { Observable } from 'rxjs/Observable';
import { retry, catchError, tap } from 'rxjs/operators';
@Injectable()
export class InterceptorService implements HttpInterceptor {
  constructor(
    
    ) {}

    intercept(
      request: HttpRequest<any>,
      next: HttpHandler
    ): Observable<HttpEvent<any>>{
    
    request = request.clone();
    return next.handle(request).pipe(retry(3),
    tap(
      event => {
        // logging the http response to browser's console in case of a success
        if (event instanceof HttpResponse) {
          console.log("api call success :", event);
        }
      },
      error => {
        // logging the http response to browser's console in case of a failuer
        if (event instanceof HttpResponse) {
          console.log("api call error :", event);
        }
      }
    ));
  }
}