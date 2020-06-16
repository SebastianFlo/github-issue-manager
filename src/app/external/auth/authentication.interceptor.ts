import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { AppState } from 'src/app/data/state';
import { Store, select } from '@ngrx/store';
import { selectToken } from 'src/app/data/core/selectors';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  token = '';

  constructor(public auth: AuthenticationService, private store: Store<AppState>) {
    store.pipe(select(selectToken)).subscribe((token) => {
      this.token = token;
    });
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.token}`,
        'content-type': 'application/json'
      },
    });
    return next.handle(request);
  }
}
