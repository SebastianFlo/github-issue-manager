import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/data/state';
import { selectToken, selectUser } from 'src/app/data/core/selectors';
import { map, switchMap, take } from 'rxjs/operators';
import { combineLatest, of, Observable} from 'rxjs';

@Injectable()
export class LoginGuard implements CanActivate {
    constructor(private store: Store<AppState>, private router: Router) {}

    canActivate(): Observable<boolean> {
      console.log('checking guard');

        const hasToken$ = this.store.pipe(select(selectToken), take(1), map(token => token.length === 40));
        const hasUser$ = this.store.pipe(select(selectUser), take(1), map(user => user.name.length > 0));

        return combineLatest(hasToken$, hasUser$).pipe(switchMap(([hasToken, hasUser]) => {
          if (!hasToken || !hasUser) {
            console.log('no access');
            this.router.navigate(['/login']);
            return of(false);
          }

          return of(hasToken && hasUser);
        }));
    }
}
