import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { catchError, map, delay, tap } from 'rxjs/operators';
import gql from 'graphql-tag';

import { AppState } from 'src/app/data/state';
import { User } from 'src/app/data/models';
import * as CoreActions from '../../data/core/actions';

@Component({
  selector: 'app-login',
  template: `
    <div class="flex-layout layout-center-v layout-center-h">
      <mat-card class="login-card">
        <mat-card-header *ngIf="!user.name">
          <mat-card-title>Github Token</mat-card-title>
          <mat-card-subtitle
            >Enter an existing Github token or create one on
            <a target="new" href="https://github.com"
              >Github</a
            ></mat-card-subtitle
          >
        </mat-card-header>

        <mat-card-content class="flex-layout layout-center-h layout-center-v">
          <div *ngIf="!user.name && !error" class="token-form">
            <mat-form-field class="input-full-width">
              <input
                [formControl]="authToken"
                class="input-full-width"
                matInput
                placeholder="Ex. ff34885a8624460a855540c6592698d2f1812843"
                value=""
              />
            </mat-form-field>

            <div
              *ngIf="authToken.errors?.pattern"
              class="flex-layout layout-center-h text-warning"
            >
              Token pattern is invalid
            </div>
          </div>

          <div *ngIf="error" class="error-form">
            <div class="flex-layout layout-center-h layout-center-v">
              <div class="flex-layout layout-center-h text-center">
                <h3>Something went wrong 🔌</h3>
                <p>{{ errorMessage }}</p>
              </div>
            </div>
          </div>

          <div *ngIf="user && user.name" class="welcome-form">
            <div class="flex-layout layout-center-h layout-center-v">
              <div>
                <h3>Welcome {{ user?.name }} 😊</h3>
              </div>
            </div>
          </div>

          <div
            *ngIf="loading && !error"
            class="flex-layout layout-center-h layout-center-v"
          >
            <mat-progress-spinner
              diameter="50"
              mode="indeterminate"
            ></mat-progress-spinner>
          </div>
        </mat-card-content>

        <mat-card-actions>
          <div
            *ngIf="!user.name && !loading"
            class="flex-layout layout-center-h"
          >
            <button
              [disabled]="!authToken.dirty || authToken.invalid"
              mat-button
              (click)="addToken()"
            >
              LOGIN
            </button>
          </div>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {

  authToken = new FormControl('');
  success = true;
  loginSubscription: Subscription;
  loading = false;
  error = false;
  errorMessage = '';
  user: User = { name: '', login: '' };

  LoginQuery = gql`
    {
      viewer {
        login
        name
      }
    }
  `;

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private apollo: Apollo
  ) {

  }

  ngOnInit() {
    this.authToken.setValidators([
      Validators.required,
      Validators.pattern('[0-9a-fA-F]{40}'),
    ]);
  }

  addToken() {
    this.loading = true;
    this.store.dispatch(
      CoreActions.SetToken({ payload: this.authToken.value })
    );

    this.loginSubscription = this.apollo
      .watchQuery({
        query: this.LoginQuery,
      })
      .valueChanges.pipe(
        map(({ data }: { data: any }) => {
          this.user = data && data.viewer;
          this.store.dispatch(CoreActions.SetUser({ payload: this.user }));
        }),
        catchError((err) => {
          this.error = true;
          this.errorMessage = err.message;
          throw 'error in login. Details: ' + err;
        }),
        delay(2 * 1e3),
        tap(() => {
          this.router.navigate(['dashboard']);
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.loginSubscription.unsubscribe();
  }
}
